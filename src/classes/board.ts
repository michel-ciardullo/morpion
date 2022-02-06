/**
 * Class Board
 *
 * This class will manage our game board
 */
export default class Board {

    /**
     * Contains all the winning situations
     *
     * @var Array<number>
     */
    public static WINNER_SITUATIONS = [
        // horizontal
        [ 0, 1, 2 ], // line 1
        [ 3, 4, 5 ], // line 2
        [ 6, 7, 8 ], // line 3

        // vertical
        [ 0, 3, 6 ], // column 1
        [ 1, 4, 7 ], // column 2
        [ 2, 5, 8 ], // column 3

        // diagonal
        [ 0, 4, 8 ], // top left -> bottom right
        [ 2, 4, 6 ], // top right -> bottom left
    ]

    /**
     * Contain the current board states
     *
     * @return Array<number>
     */
    private readonly states: Array<number>

    /**
     * Constructor Board
     *
     * @param states
     */
    public constructor( states: Array<number> = [] ) {
        this.states = states.length > 0 ? states : Board.createStates()
    }

    /**
     * Get available boxes for the current state
     *
     * @return Array<number> Returns an array containing available boxes for the current state
     */
    public getAvailable() : Array<number> {
        return this.states.filter( state => state <= 0 )
    }

    /**
     * Get the current states for the board.
     *
     * @return Array<number>
     */
    public getStates() : Array<number> {
        return this.states
    }

    /**
     * If the current box is available
     *
     * @param index index selected
     * @return true if available
     */
    public hasStateAvailable( index: number ) : boolean {
        return this.states[ index ] <= 0
    }

    /**
     * Modify a state of the board
     *
     * @param index
     * @param playerIndex
     */
    public setState( index: number, playerIndex: number ) : boolean  {
        // If the current box is available
        if ( this.hasStateAvailable( index ) ) {
            // Change the state of the current box by the value of the player who plays it
            this.states[ index ] = playerIndex

            // Return a success
            return true
        }

        // Return failure
        return false
    }

    /**
     * Holds a winner if present otherwise will return a 0
     *
     * Situation winner
     *
     * - 0 no player to win
     * - 1 player X to win
     * - 2 player O to win
     *
     * @return number Situation winner
     */
    public winner() : number {
        // Go through all the winning situations
        for (
            let i = 0;
            i < Board.WINNER_SITUATIONS.length;
            i++
        ) {
            // Recovers the current situation of the iteration
            const winnerSituation = Board.WINNER_SITUATIONS[ i ]

            // Get the first value of the iterated situation
            const a = winnerSituation[ 0 ]

            // If the box is taken by player 1 or 2
            if ( this.states[ a ] === 1 || this.states[ a ] === 2 )
            {
                // If it matches, we check that the following ones also match
                const b = winnerSituation[ 1 ]
                const c = winnerSituation[ 2 ]

                if (
                    // If the first value matches the second
                    this.states[ a ] === this.states[ b ] &&
                    // If the second corresponds with the last
                    this.states[ b ] === this.states[ c ]
                ) {
                    // The value of the winning player is returned, i.e. 1 or 2
                    return this.states[ a ]
                }
            }
        }

        // If no situation was found, we return 0
        return 0
    }

    /**
     * If game is tie
     *
     * @return boolean true if game is tie
     */
    public isTie() : boolean {
        return this.getAvailable().length === 0 && this.winner() === 0
    }

    /**
     * Get if the board is terminal.
     *
     * @return boolean true if end game board
     */
    public isTerminal() : boolean {
        return this.winner() === 1 || this.winner() === 2 || this.isTie()
    }

    /**
     * Create new states with values index negation.
     *
     * @return Array<number> New states
     */
    private static createStates() : Array<number> {
        const states = [ 0 ]

        for (
            let i = 1;
            i < 9;
            i++
        ) {
            states.push( -i )
        }

        return states
    }
}
