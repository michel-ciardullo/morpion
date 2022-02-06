import Board from './classes/board'
import Player from './classes/player'
import {
  EStartingPlayer,
  ESymbol
} from './classes/types'
import './scss/style.scss'

  ;(function () {
  const boardElement = document.querySelectorAll( '#grid td' )
  const alertElement = document.getElementById( 'alert' ) as HTMLElement

  let startingPlayer: EStartingPlayer
  let playerTurn : EStartingPlayer
  let board: Board
  let player:  Player

  function resetAlert() {
    alertElement.innerText = ''
    alertElement.classList.remove( 'alert-warning' )
    alertElement.classList.remove( 'alert-success' )
    alertElement.classList.remove( 'alert-danger' )
    alertElement.classList.remove( 'alert-info' )
  }

  function endGame() : boolean
  {
    // If the current game has terminated
    if ( board.isTerminal() )
    {
      if ( board.isTie() ) {
        alertElement.innerText = 'Vous avais fais match nul'
        alertElement.classList.add( 'alert-warning' )
        return true
      }

      const winner = board.winner()

      if ( winner === (startingPlayer === 0 ? 2 : 1) ) {
        alertElement.innerText = 'Vous avais gagner'
        alertElement.classList.add( 'alert-success' )
      }
      else {
        alertElement.innerText = 'Le bot à gagner'
        alertElement.classList.add( 'alert-danger' )
      }

      return true
    }

    return false
  }

  function onClick( maximizing: boolean, element: HTMLElement, index: number ) : void
  {
    resetAlert()

    if ( playerTurn === EStartingPlayer.Bot ) return

    if ( board.isTerminal() )
    {
      alertElement.innerText = 'Le jeu est terminé, commencez-en un autre'
      alertElement.classList.add( 'alert-danger' )
      return
    }

    // If the index is not available
    else if ( !board.hasStateAvailable( index ) )
    {
      alertElement.innerText = "Cette case n'est pas disponible, choisissez-en un autre !"
      alertElement.classList.add( 'alert-danger' )
    }
    else // Otherwise, the index can be attributed as taken by player X
    {
      // Maximizing player is always 'x'
      // const symbol = maximizing ? ESymbol.X : ESymbol.O

      // If the index specified status has been recorded
      if ( board.setState( index, maximizing ? ESymbol.X : ESymbol.O ) )
      {
        // Add HTML class for rendering
        element.classList.add( maximizing ? 'x' : 'o' )

        // If the game is not finished
        if ( !endGame() )
        {
          playerTurn = EStartingPlayer.Bot //Switch turns

          // We make play the bot
          player.playBestMove( board, 0, !maximizing, bestMove => {
            if ( board.setState( bestMove, !maximizing ? ESymbol.X : ESymbol.O ) )
            {
              // Add HTML class for rendering
              boardElement[ bestMove ].classList.add( !maximizing ? 'x' : 'o' )

              endGame()
            }

            playerTurn = EStartingPlayer.Human // Switch turns
          } )
        }
      }
    }
  }

  /**
   * Starts a new game with a certain depth and a startingPlayer of 1 if human is going to start
   *
   * @return void
   */
  function newGame( depth: number = -1 ) : void
  {
    resetAlert()

    // Instantiating of an empty card.
    board = new Board()

    // Instantiating a new player.
    player = new Player( depth )

    // Initializing some variables for internal use

    // startingPlayer/EStartingPlayer
    // - Bot = 0 (minimizing)
    // - Human = 1 (maximizing)
    const maximizing = Boolean( startingPlayer )
    playerTurn = startingPlayer

    // @ts-ignore
    boardElement.forEach(( element: HTMLElement, index: number ) => {
      // Clearing current HTML
      element.classList.remove( 'x' )
      element.classList.remove( 'o' )

      // Adding Click event listener for each cell
      element.onclick = function () {
        onClick( maximizing, element, index )
      }
    })

    // If computer is going to start, choose a random cell as long as it is the center or a corner
    if ( startingPlayer === EStartingPlayer.Bot )
    {
      const centerAndCorners = [ 0, 2, 4, 6, 8 ]
      const firstChoice = centerAndCorners[ Math.floor(Math.random() * centerAndCorners.length ) ]

      if ( board.setState( firstChoice, !maximizing ? ESymbol.X : ESymbol.O ) )
      {
        boardElement[ firstChoice ].classList.add( !maximizing ? 'x' : 'o' )
      }

      playerTurn = EStartingPlayer.Human; // Switch turns
    }
  }

  /**
   * Start a new game with chosen options when new game button is clicked
   *
   * @param event
   * @return void
   */
  function onSubmitNewGame( event: Event ) : void
  {
    // Prevent handle reload page submitted.
    event.preventDefault()

    const { target } = event

    // 0 = Player
    // 1 = Bot
    const startingPlayerSelect: HTMLSelectElement = (<any>target)[ 'starting-player' ]
    startingPlayer = startingPlayerSelect.selectedIndex

    // 1:4 = depth difficulty
    // -1 = Unlimited
    const depthDifficultySelect: HTMLSelectElement = (<any>target)[ 'depth-difficulty' ]
    const depthDifficultySelectedIndex: number = depthDifficultySelect.selectedIndex

    const depthDifficultyValue: number = parseInt(
      depthDifficultySelect.options[ depthDifficultySelectedIndex ].value
    )

    // Starting new game with params specified.
    newGame( depthDifficultyValue )
  }

  // Add event listener to on submitted form
  (document.getElementById( 'form-options' ) as HTMLElement)
    .addEventListener( 'submit', onSubmitNewGame )
})()
