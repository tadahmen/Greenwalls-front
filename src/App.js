import React from 'react';
import PlantMenu from './PlantMenu';

class App extends React.Component {
    render() {
        return (
          <div className="container master">
            <PlantMenu />   {/*only temporary to test PlantMenu*/}
            {/*{this.props.children}*/}
          </div>
        );
    }
}

export default App;
