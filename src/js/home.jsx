var React           = require( 'react' );
var Router          = require( 'react-router' );
var classnames      = require( 'classnames' );

/**
 * Injects the router into the class
 * @param  {React.Component} cl the class of your component
 * @return {React.Component}
 */
function injectRouter( cl ) {
    cl.contextTypes = {
        router: React.PropTypes.func.isRequired
    };

    return cl;
}


class NavBar extends React.Component {
    constructor( props ) {
        super( props );
    }

    render() {
        return (
            <nav className="navbar navbar-default">
              <div className="container-fluid">
                <div className="navbar-header">
                  <a className="navbar-brand" href="#">React movie</a>
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav">
                    <li><a href={this.context.router.makeHref( 'MovieList' )}>My movies</a></li>
                  </ul>
                </div>
              </div>
            </nav>
        );
    }
}

injectRouter( NavBar );

/**
 *
 * HOME PAGE
 *
 */
class Home extends React.Component {
    constructor( props ) {
        super( props )
    }

    render(){
        return (
            <div id="wrapper">
                <NavBar/>
                <Router.RouteHandler />
            </div>
        );
    }
}

module.exports = injectRouter( Home );
