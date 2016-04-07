import React from 'react';
import jQuery from 'jquery';
import PlantMenu from './PlantMenu';

class PlantSpots extends React.Component {
  constructor() {
    super()

    this.state = {
      plantSpots: [{x_position:"0"}, {x_position:"1"}, {x_position:"2"}],
      count: 3,
      plantSpot: ""
    }
  }

  reloadPlantSpots(plantsContainerId) {
    let component = this;
    console.log("containerId for loading PlantSpots:" + plantsContainerId);
    console.log("this.props.plantsContainerId: " + this.props.plantsContainerId);

    jQuery.getJSON(`http://localhost:5000/plants_containers/${plantsContainerId}/plant_spots`, function(data) {
      console.log("loaded plantspots: " + data);
      component.setState({
        plantSpots: data.plant_spots,
        count: data.meta.count
      });
    })
  }

  selectSpot(event) {
    console.log("event is:" + event);
    this.setState({plantSpot: event});
    console.log("plantspot after setState: " + this.state.plantSpot)
  }

  componentDidMount() {
    console.log("PlantSpots did Mount");
    this.reloadPlantSpots(this.props.plantsContainerId);
  }

  componentWillReceiveProps(nextProps) {  //so it refreshes each time another plantscontainer is selected, and uses the newest props
    this.setState({
      plantSpot: "",
      plantsContainerId: nextProps.plantsContainerId
    });
    this.reloadPlantSpots(nextProps.plantsContainerId);
    console.log("PlantSpots did reload");
  }

  render(){
    return(
      <div>
        <PlantMenu plantSpot={this.state.plantSpot}/>
        <p>Plantcontainer: {this.props.plantsContainerName}</p>
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

export default PlantSpots;
