import React from 'react';
import './stylesheets/components.scss';
import PlantsContainerList from './PlantsContainerList';  //only for testing that component

class App extends React.Component {
    render() {
        return (
          <div className="container master">
            <PlantsContainerList />   {/*only temporary to test that component*/}
            {/*{this.props.children}*/}
          </div>
        );
    }
}

export default App;
