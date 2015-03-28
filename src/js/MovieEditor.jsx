var React           = require( 'react' );
var _               = require( 'lodash' );
var { injectRouter }= require( './utils' );

var MovieActions    = require( './stores/MovieActions' );
var MovieStore      = require( './stores/MovieStore' );
var FluxComponent   = require( 'airflux/lib/FluxComponent' );


/**
 * The form to edit a movie.
 * The component does only the rendering.
 */
class MovieForm extends React.Component {
    constructor( props ) {
        super( props );

        /**
         * As a rule of thumb, props should never be put into the state.
         * Here, `props.movie` should never be placed in a state.
         * We do place here a copy that is going to be edited. Props will hold the initial movie (if any)
         *
         * @type {Object}
         */
        this.state = { movie: props.movie };
    }


    /**
     * A function returning a ValueLink object is the recommanded way in React to bind inputs
     */
    linkMovieState( key ) {
        return {
            value: this.state.movie[ key ],
            requestChange: ( value ) => {
                /**
                 * setState replaces a whole key. therefore we need to change the movie object and repass it
                 * to setState.
                 * Stay tuned for a better way to do this in the next steps..
                 */
                var movieState = this.state.movie;
                movieState[ key ] = value;
                this.setState( { movie: movieState } )
            }
        };
    }

    saveMovie() {
        MovieActions.addMovie( this.state.movie );
        this.context.router.transitionTo( 'MovieList' );
    }

    render() {
        return (
            <div>
                <div className="modal-body">
                    <form className="form-horizontal">
                        <div className="control-group">
                            <label className="control-label">Title :</label>
                            <input type="text" valueLink={this.linkMovieState( 'title' )}/>
                        </div>
                        <div className="control-group">
                            <label className="control-label">Year :</label>
                            <input type="text" valueLink={this.linkMovieState( 'releaseYear' )}/>
                        </div>
                        <div className="control-group">
                            <label className="control-label">Directors : </label>
                            <input type="text" valueLink={this.linkMovieState( 'directors' )}/>
                        </div>
                        <div className="control-group">
                            <label className="control-label">Actors :</label>
                            <input type="text" valueLink={this.linkMovieState( 'actors' )}/>
                        </div>
                        <div className="control-group">
                            <label className="control-label">Stars :</label>
                            <input type="number" placeholder="Between 1 and 5" valueLink={this.linkMovieState( 'rate' )}/>
                        </div>
                    </form>

                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={this.saveMovie.bind( this )}>Save changes</button>
                </div>
            </div>
        );
    }
}

MovieForm.propTypes = {
    movie       : React.PropTypes.object,
    saveMovie   : React.PropTypes.func.isRequired
};
injectRouter( MovieForm );




/**
 * The other half of the page.
 * This Flux component does the loading/synchronising with Flux stores and actions.
 *
 * It is best to keep the code loading data from the one rendering it.
 * This ensures simple thing such as the MovieForm will always receives an Movie object in props,
 * and doesn't have to to checks whether it has an object.
 *
 */
class MovieEditor extends FluxComponent {
    constructor( props ) {
        super( props, { movieLoaded: MovieActions.find.completed, onError: MovieActions.find.failed } );
        this.state = { movie: null, error: null };
    }

    loadMovie() {
        var id = this.context.router.getCurrentParams().id;
        if( id ) {
            // reinit first
            this.setState( { movie: null, error: null } );
            MovieStore.find( id );
        }
        else {
            this.setState( { movie: {}, error: null } );
        }
    }

    movieLoaded( movie ) {
        this.setState( { movie: movie } );
    }

    onError( e ) {
        this.setState( { movie: null, error: e } );
    }

    /**
     * When the component is mounted by React router, we trigger the actions to load the movie.
     */
    componentDidMount() {
        // classes inheriting from FluxComponent need to call `super.componentDidMount`
        super.componentDidMount();
        this.loadMovie();
    }

    /**
     * When an id of the route changes, React router keeps the same component mounted, and just
     * sends out new props.
     */
    componentWillReceiveProps( nextProps ) {
        this.loadMovie();
    }

    render() {
        if( this.state.error ) {
            return <div>{this.state.error}</div>
        }
        else if( !this.state.movie ) {
            return <div>Loading...</div>;
        }

        return (
            <MovieForm movie={this.state.movie}/>
        );
    }
}
injectRouter( MovieEditor );


module.exports = MovieEditor;
