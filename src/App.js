import React from 'react';
import './stylesheets/components.scss';
import PlantsContainerList from './PlantsContainerList';

class App extends React.Component {
    render() {
        return (
          <div className="containerMaster">
            <PlantsContainerList />
          </div>
        );
    }
}

export default App;
