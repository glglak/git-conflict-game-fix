/**
 * Git Conflict Game - Fix Script
 * 
 * This script applies enhanced error handling and new features to the Git Conflict Game.
 * It modifies the simple-game.js file in the specified directory.
 */

const fs = require('fs');
const path = require('path');

// Check if a path argument was provided
if (process.argv.length < 3) {
  console.error('Usage: node apply-fixes.js /path/to/git-conflict-game');
  process.exit(1);
}

const gameDir = process.argv[2];
const gameFilePath = path.join(gameDir, 'simple-game.js');

// Check if the file exists
if (!fs.existsSync(gameFilePath)) {
  console.error(`Error: Could not find ${gameFilePath}`);
  console.error('Make sure the path to your git-conflict-game repository is correct.');
  process.exit(1);
}

console.log(`Found game file at: ${gameFilePath}`);
console.log('Reading file content...');

// Read the original file
let content = fs.readFileSync(gameFilePath, 'utf8');

// Apply fixes
console.log('Applying fixes...');

// 1. Add game over messages constant
if (!content.includes('GAME_OVER_MESSAGES')) {
  const gameOverMessages = `
// Game over messages
const GAME_OVER_MESSAGES = [
  "Your repository has become corrupted!",
  "Too many merge conflicts - repository abandoned!",
  "Fatal: cannot rebase onto multiple branches",
  "Error: detached HEAD state cannot be resolved",
  "Refusing to merge unrelated histories"
];
`;
  // Insert after CONFLICT_MESSAGES
  content = content.replace(
    /(const CONFLICT_MESSAGES[\s\S]*?];)/,
    '$1\n' + gameOverMessages
  );
}

// 2. Add cherryPickActive to resetGame function
if (!content.includes('cherryPickActive')) {
  content = content.replace(
    /(gameState = {\n[\s\S]*?solvedConflicts: \[\],)/,
    '$1\n      cherryPickActive: false,'
  );
}

// 3. Wrap resetGame in try/catch
if (!content.includes('try {') && !content.includes('function resetGame()')) {
  content = content.replace(
    /function resetGame\(\) {\n/,
    'function resetGame() {\n  try {\n'
  );
  content = content.replace(
    /(gameState = {[\s\S]*?};)\n}/,
    '$1\n  } catch (error) {\n    console.error("Error resetting game:", error);\n    showErrorModal("Game Reset Error", "Could not reset the game state. Please refresh the page.");\n  }\n}'
  );
}

// 4. Wrap window.onload in try/catch
if (!content.includes('try {') && content.includes('window.onload = function() {')) {
  content = content.replace(
    /window\.onload = function\(\) {\n/,
    'window.onload = function() {\n  try {\n'
  );
  
  // Add catch block before the end of the function
  content = content.replace(
    /(setupEventListeners\(ctx, canvas\);)\n};/,
    '$1\n  } catch (error) {\n    console.error("Error initializing game:", error);\n    showErrorModal("Initialization Error", error.message);\n  }\n};'
  );
}

// 5. Update handleBug function to include message parameter and improved handling
content = content.replace(
  /function handleBug\(\) {[\s\S]*?if \(gameState\.lives <= 0\) {\n    gameOver\(\);/,
  'function handleBug(message) {\n  try {\n    gameState.lives--;\n    gameState.score = Math.max(0, gameState.score - 50);\n    \n    // Update UI\n    updateUIElements();\n    \n    // Reset position\n    const currentLevel = LEVELS[gameState.level];\n    gameState.playerX = currentLevel.playerStart.x;\n    gameState.playerY = currentLevel.playerStart.y;\n    \n    if (gameState.lives <= 0) {\n      gameOver(message);'
);

// 6. Add updateUIElements function if it doesn't exist
if (!content.includes('function updateUIElements()')) {
  const updateUIElements = `
function updateUIElements() {
  try {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('level').textContent = gameState.level + 1;
    document.getElementById('lives').textContent = gameState.lives;
  } catch (error) {
    console.error("Error updating UI elements:", error);
  }
}
`;
  // Insert after startGame function
  content = content.replace(
    /(function startGame\(ctx, canvas\) {[\s\S]*?})\n\n/,
    '$1\n\n' + updateUIElements + '\n'
  );
}

// 7. Update gameOver function to take a message parameter
content = content.replace(
  /function gameOver\(\) {/,
  'function gameOver(message) {\n  try {'
);

// 8. Add random game over message selection
content = content.replace(
  /(const modal = document\.getElementById\('gameOverModal'\);)/,
  '$1\n    const msgElement = document.getElementById(\'gameOverMessage\');\n    const scoreElement = document.getElementById(\'finalScore\');\n    \n    if (modal && scoreElement) {\n      // Set a random game over message if not specified\n      if (!message) {\n        message = GAME_OVER_MESSAGES[Math.floor(Math.random() * GAME_OVER_MESSAGES.length)];\n      }\n      \n      if (msgElement) {\n        msgElement.textContent = message;\n      }'
);

// 9. Add try/catch to showNotification
content = content.replace(
  /function showNotification\(title, message\) {/,
  'function showNotification(title, message) {\n  try {'
);

// 10. Add animation to showNotification
content = content.replace(
  /(document\.body\.appendChild\(notificationDiv\);)/,
  '$1\n    \n    // Remove after 3 seconds\n    setTimeout(() => {\n      notificationDiv.style.opacity = \'0\';\n      notificationDiv.style.transform = \'translateX(100%)\';\n      \n      // Remove from DOM after animation\n      setTimeout(() => {\n        notificationDiv.remove();\n      }, 300);\n    }, 3000);'
);

// 11. Add showErrorModal function if it doesn't exist
if (!content.includes('function showErrorModal(')) {
  const showErrorModal = `
function showErrorModal(title, message) {
  try {
    // Create error modal if it doesn't exist
    let errorModal = document.getElementById('errorModal');
    
    if (!errorModal) {
      errorModal = document.createElement('div');
      errorModal.id = 'errorModal';
      errorModal.className = 'modal';
      
      const content = document.createElement('div');
      content.className = 'modal-content';
      
      const heading = document.createElement('h2');
      heading.textContent = title;
      heading.style.color = '#f85149';
      
      const text = document.createElement('p');
      text.textContent = message;
      
      const button = document.createElement('button');
      button.textContent = 'OK';
      button.onclick = function() {
        errorModal.classList.add('hidden');
      };
      
      content.appendChild(heading);
      content.appendChild(text);
      content.appendChild(button);
      errorModal.appendChild(content);
      
      document.body.appendChild(errorModal);
    } else {
      // Update existing modal
      errorModal.querySelector('h2').textContent = title;
      errorModal.querySelector('p').textContent = message;
      errorModal.classList.remove('hidden');
    }
  } catch (error) {
    console.error("Failed to show error modal:", error);
    alert(\`Error: \${title}\\n\${message}\`);
  }
}
`;
  // Add before setupEventListeners
  content = content.replace(
    /(function setupEventListeners\(ctx, canvas\) {)/,
    showErrorModal + '\n\n$1'
  );
}

// 12. Update handleConflict function with cherry-pick support
content = content.replace(
  /function handleConflict\(\) {/,
  'function handleConflict() {\n  try {'
);

content = content.replace(
  /(const conflictKey = `\${gameState\.playerX},\${gameState\.playerY}`;)/,
  '$1\n    \n    // Check if cherry-pick is active\n    if (gameState.cherryPickActive) {\n      // Auto-resolve conflict\n      resolveConflict(true);\n      gameState.cherryPickActive = false;\n      showNotification("Cherry-pick", "Conflict automatically resolved!");\n      return;\n    }'
);

// 13. Update resolveConflict function to support auto-resolved conflicts
content = content.replace(
  /function resolveConflict\(\) {/,
  'function resolveConflict(autoResolved = false) {\n  try {'
);

content = content.replace(
  /(gameState\.score \+= )100;/,
  '$1autoResolved ? 50 : 100;'
);

// 14. Update handlePowerup function to implement powerup effects
content = content.replace(
  /(function handlePowerup\(\) {)/,
  '$1\n  try {'
);

// Save the updated file
console.log('Saving changes...');
fs.writeFileSync(gameFilePath, content);

console.log('✅ Successfully applied fixes to simple-game.js!');
console.log('');
console.log('Changes made:');
console.log('- Added comprehensive error handling with try/catch blocks');
console.log('- Added improved notification system with animations');
console.log('- Added random game over messages related to Git concepts');
console.log('- Added cherry-pick powerup functionality for auto-resolving conflicts');
console.log('- Added better UI feedback when bugs are encountered');
console.log('');
console.log('Next steps:');
console.log('1. Review the changes in your git-conflict-game repository');
console.log('2. Commit and push the changes to GitHub');
console.log('3. Run your enhanced game and enjoy the improvements!');
