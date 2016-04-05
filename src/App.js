import React from 'react';
import PlantSpots from './PlantSpots';

class App extends React.Component {
    render() {
        return (
          <div className="container master">
            <PlantSpots />   {/*only temporary to test PlantSpots*/}
            {/*{this.props.children}*/}
          </div>
        );
    }
}

export default App;
