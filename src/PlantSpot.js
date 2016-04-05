import React from 'react';
import jQuery from 'jquery';
import PlantMenu from './PlantMenu';

class PlantSpot extends React.Component {
  constructor() {
    super()

    this.state = {
      plantSpots: [{x_position:"0"}, {x_position:"1"}, {x_position:"2"}],
      count: 3,
      plantSpot: 1
    }
  }

  // reloadPlantSpots(event) {
  //   let component = this;
  //   let plantContainerId = this.props.params.plantContainerId;
  //
  //   jQuery.getJSON(`http://localhost:5000/${plantContainerId}/plant_spots`, function(data) {
  //     console.log(data);
  //     component.setState({
  //       plantSpots: data.plant_spots
  //     });
  //   })
  // }

  selectSpot(event) {
    console.log("event is:" + event)
    console.log("plantspot before setState: " + this.state.plantSpot);
    this.setState({plantSpot: event});
    console.log("plantspot after setState: " + this.state.plantSpot)
  }

  // componentDidMount() {
  //   console.log("didMount");
  //   this.reloadPlants();
  // }

  render(){
    return(
      <div>
        <PlantMenu plantSpot={this.state.plantSpot}/>
        <p>plantspots:</p>
        <div>
            {
              this.state.plantSpots.map(function(plantSpot, i){
                return(
                  <button onClick={this.selectSpot.bind(this, plantSpot.x_position)}>
                    <img className="plantSpot" src="https://www.onlinepakhuis.nl/data/Bloempotten/bloempot-julia-oranje-d55-h50.jpg"/>
                  </button>);
              }, this)
            }
            </div>
      </div>
    );
  }
}

export default PlantSpot;
