# Git Conflict Game - Enhanced Error Handling Script

This repository contains a script and styles that will automatically apply enhanced error handling and UI improvements to the Git Conflict Game.

## How to Use

1. Clone this repository:
   ```
   git clone https://github.com/glglak/git-conflict-game-fix.git
   ```

2. Navigate to the cloned directory:
   ```
   cd git-conflict-game-fix
   ```

3. Run the script, providing the path to your git-conflict-game repository:
   ```
   node apply-fixes.js /path/to/git-conflict-game
   ```

4. Copy the CSS styles to your game's CSS file:
   ```
   cat styles.css >> /path/to/git-conflict-game/styles.css
   ```
   (Or manually copy the contents if you prefer)

5. Make sure to include the CSS in your HTML file if it's not already included:
   ```html
   <link rel="stylesheet" href="styles.css">
   ```

6. Add the gameOverMessage element to your game-over modal in your HTML file:
   ```html
   <div id="gameOverModal" class="modal hidden">
     <div class="modal-content">
       <h2>Game Over</h2>
       <p id="gameOverMessage"></p>
       <p>Final score: <span id="finalScore">0</span></p>
       <button id="newGameButton">New Game</button>
     </div>
   </div>
   ```

7. Commit the changes in your git-conflict-game repository

## What This Script Does

The script enhances your game with:

1. **Comprehensive error handling** with try/catch blocks throughout the code
   - Prevents the game from crashing on unexpected errors
   - Provides informative error messages to users

2. **Improved notification system** with styling and animations
   - Better visual feedback
   - Notifications fade out after displaying

3. **Random game over messages** related to Git concepts
   - Makes the game more engaging and educational
   - Ties into the Git theme of the game

4. **Cherry-pick powerup** for auto-resolving conflicts
   - New gameplay mechanic
   - Allows automatic conflict resolution

5. **Better UI feedback** when bugs are encountered
   - Clear messaging about lives remaining
   - More informative error modals

## Implementation Details

The `apply-fixes.js` script analyzes the existing code structure and applies the necessary changes without overwriting any customizations you may have made. It adds new functions like `showErrorModal` and enhances existing ones like `handleBug` and `resolveConflict`.

The CSS styles add visual enhancements for notifications, modals, and error messages.
