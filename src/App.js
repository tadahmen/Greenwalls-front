import React from 'react';
import './stylesheets/_bootstrap.scss';
import './stylesheets/components.scss';
import PlantsContainerList from './PlantsContainerList';

class App extends React.Component {
    render() {
        return (
          <div className="containerMaster">
            <nav className="navbar navbar-inverse">
              <div className="container-fluid">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  <a className="navbar-brand" href="#">Logo</a>
                </div>
                <div className="collapse navbar-collapse" id="myNavbar">
                  <ul className="nav navbar-nav">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li className="active"><a href="#">Create plant containers</a></li>
                    <li><a href="#">Contact</a></li>
                  </ul>
                  <ul className="nav navbar-nav navbar-right">
                    <li><a href="#"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
                  </ul>
                </div>
              </div>
            </nav>

            <PlantsContainerList />

            <footer className="footer container-fluid text-center">
              <p>We like serving you. Contact us for help and questions.</p>
            </footer>
          </div>
        );
    }
}

export default App;
