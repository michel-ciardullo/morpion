import Board from './board'
import { ESymbol } from './types'

declare type BestMoveCallback = ( bestMove: number ) => void

export default class Player {
    private readonly nodes: Map<number, string>

    /**
     * Constructor Player
     *
     * @param maxDepth
     */
    public constructor(
        private maxDepth: number = -1
    ) {
        this.nodes = new Map<number, string>()
    }

    public playBestMove( board: Board, depth: number, maximizing = true, callback: BestMoveCallback ) : number
    {
        // clear nodes if the function is called for a new move
        if ( depth == 0 )
        {
            this.nodes.clear()
        }

        // If the board state is a terminal one, return the heuristic value
        if ( board.isTerminal() || depth === this.maxDepth )
        {
            if ( board.winner() === ESymbol.X )
            {
                return Infinity - depth
            }
            else if ( board.winner() === ESymbol.O )
            {
                return -Infinity + depth
            }

            return 0
        }

        let bestScore : number

        if ( maximizing )
        {
            // Initialize best to the lowest possible value
            bestScore = -Infinity

            // Loop through all empty cells
            board.getAvailable().forEach(availableIndexNegation => {
                const availableIndex = Math.abs( availableIndexNegation )

                // Create a child node by inserting the maximizing symbol x into the current empty cell
                const newBoard = Player.createNewBoard( board, availableIndex, ESymbol.X )

                // Recursively calling getBestMove this time with the new board and minimizing turn and incrementing the depth
                const score = this.playBestMove( newBoard, depth + 1, false, callback )

                // Updating best value
                bestScore = Math.max( bestScore, score )

                // If it's the main function call, not a recursive one, map each heuristic value with it's moves indices
                if ( depth == 0 ) {
                    // Comma separated indices if multiple moves have the same heuristic value
                    const moves = this.nodes.has( score ) ? `${this.nodes.get( score )},${availableIndex}` : `${availableIndex}`
                    this.nodes.set( score, moves )
                }
            })
        }
        else
        {
            // Initialize best to the highest possible value
            bestScore = Infinity

            // Loop through all empty cells
            board.getAvailable().forEach(availableIndexNegation => {
                const availableIndex = Math.abs( availableIndexNegation )

                // Create a child node by inserting the minimizing symbol o into the current empty cell
                const newBoard = Player.createNewBoard( board, availableIndex, ESymbol.O )

                // Recursively calling getBestMove this time with the new board and maximizing turn and incrementing the depth
                const score = this.playBestMove( newBoard, depth + 1, true, callback )

                // Updating best value
                bestScore = Math.min( bestScore, score )

                // If it's the main function call, not a recursive one, map each heuristic value with it's moves indices
                if ( depth == 0 )
                {
                    // Comma separated indices if multiple moves have the same heuristic value
                    const moves = this.nodes.has( score ) ? `${this.nodes.get( score )},${availableIndex}` : `${availableIndex}`
                    this.nodes.set( score, moves )
                }
            })
        }

        // If it's the main call, return the index of the best move or a random index if multiple indices have the same value
        this.randomIfMultipleIndex( depth, bestScore, callback )

        // If not main call (recursive) return the heuristic value for next calculation
        return bestScore
    }

    private randomIfMultipleIndex( depth: number, bestScore: number, callback: BestMoveCallback ) : void
    {
        // If it's the main call, return the index of the best move or a random index if multiple indices have the same value
        if ( depth == 0 )
        {
            let returnValue
            if ( typeof this.nodes.get( bestScore ) == 'string' )
            {
                // @ts-ignore
              const arr = this.nodes.get( bestScore ).split( ',' )
                const rand = Math.floor(Math.random() * arr.length )
                returnValue = arr[ rand ]
            } else {
                returnValue = this.nodes.get( bestScore )
            }
            // run a callback after calculation and return the index
            // @ts-ignore
            callback( returnValue )
            return
        }
    }

    private static createNewBoard( board: Board, availableIndex: number, symbol: ESymbol ) : Board
    {
        // Initialize a new board with a copy of our current state
        const newStates = [ ...board.getStates() ]
        const newBoard = new Board( newStates )

        // Create a child node by inserting the maximizing/minimizing symbol x/o into the current empty cell
        newBoard.setState( availableIndex, symbol )

        return newBoard
    }
}
