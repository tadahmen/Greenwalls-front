import React from 'react';
import jQuery from 'jquery';
import PlantMenu from './PlantMenu';
import PlantSpot from './PlantSpot';

class PlantSpots extends React.Component {
  constructor() {
    super()

    this.state = {
      plantSpots: [{x_position:"0"}, {x_position:"1"}, {x_position:"2"}],
      count: 3,
      plantSpotPosition: ""
    }
  }

  reloadPlantSpots(plantsContainerId) {
    let component = this;
    console.log("LOADING PLANT SPOTS FROM DB");
    console.log("containerId for loading PlantSpots:" + plantsContainerId);
    console.log("id in props is: " + this.props.plantsContainerId); //shows that props still holds previous value

    jQuery.getJSON(`http://localhost:5000/plants_containers/${plantsContainerId}/plant_spots`, function(data) {
      console.log("loaded plantspots: " + data);
      component.setState({
        plantSpots: data.plant_spots,
        count: data.meta.count,
      });
    })
  }

  // loadPlants() {
  //   let component = this;
  //   console.log("LOADING PLANTS FROM DB");
  //
  //   jQuery.getJSON(`http://localhost:5000/plants`, function(data) {
  //     console.log("loaded Plantlist in plant spots: " + data);
  //     component.setState({
  //       plants: data.plants
  //     });
  //   })
  // }

  findById(plantId) {
    console.log("SEARCHING PLANT with id: " + plantId);
    let plantList = this.props.plants;
    console.log("aantal planten in lijst:" + plantList.length)
    // return {picture: "https://www.onlinepakhuis.nl/data/Bloempotten/bloempot-julia-oranje-d55-h50.jpg"} //to find bug
    for (var i = 0; i < plantList.length; i++) {
      if (plantList[i].id === plantId) {
        // console.log("found plant with picture: " + plant.picture);
        return plantList[i]
      }
    }
        // console.log("no plant found; returning default picture");
      return {picture: "https://www.onlinepakhuis.nl/data/Bloempotten/bloempot-julia-oranje-d55-h50.jpg"}
    }

  showPlantSpot(plantId) {
    let plant = this.findById(plantId);

    console.log("using picture: " + plant.picture);
    let plantPicture = plant.picture;
    return <img className="plantSpot" src={plantPicture}/>
  }

  selectSpot(event) {
    console.log("SETTING PLANT SPOT TO SELECTED SPOT");
    console.log("id in selectSpot:" + event.plantSpotId);
    console.log("position of selected spot (0 for first): " + event.plantSpotPosition);
    this.setState({
      plantSpotPosition: event.plantSpotPosition,
      plantSpotId: event.plantSpotId
    });
    console.log("plantspot after setState: " + this.state.plantSpotPosition)
  }

  componentDidMount() {
    console.log("Mount PlantSpots");
    console.log("this.props.plants is:" + this.props.plants);
    // this.loadPlants();
    this.reloadPlantSpots(this.props.plantsContainerId);
  }

  componentWillReceiveProps(nextProps) {  //so it refreshes each time another plantscontainer is selected, and uses the newest props
    console.log("reload PlantSpots");
    this.setState({
      plantSpotPosition: "",
      plantsContainerId: nextProps.plantsContainerId
    });
    this.reloadPlantSpots(nextProps.plantsContainerId);
  }

  render(){
    return(
      <div>
        <PlantMenu plantSpotPosition={this.state.plantSpotPosition} plantSpotId={this.state.plantSpotId} plantsContainerId={this.props.plantsContainerId}/>
        <p>Plantcontainer: {this.props.plantsContainerName}</p>
        <div>
            {
              this.state.plantSpots.map(function(plantSpot, i){
                return(
                  <button onClick={this.selectSpot.bind(this, {plantSpotPosition: plantSpot.x_position, plantSpotId: plantSpot.id, plantsContainerId: this.props.plantsContainerId})}>
                    <p> {plantSpot.plant_id} </p>
                    {
                      console.log("calling function showPlantSpot"),
                      this.showPlantSpot(plantSpot.plant_id) //.bind(this)
                      // plantSpot.plant_id !== undefined
                      //   ? this.showPlantSpot.bind(this, plantSpot.plant_id)
                      //   : console.log("plant id at check is undefined")
                    }
                  </button>
                );
              }, this)
            }
          </div>
      </div>
    );
  }
}

export default PlantSpots;
