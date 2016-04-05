import React from 'react';
import PlantSpot from './PlantSpot';

class App extends React.Component {
    render() {
        return (
          <div className="container master">
            <PlantSpot />   {/*only temporary to test PlantSpot*/}
            {/*{this.props.children}*/}
          </div>
        );
    }
}

export default App;
