import React from 'react';
import jQuery from 'jquery';
import PlantSpots from './PlantSpots';

class PlantsContainerList extends React.Component {
  constructor() {
    super()

    this.state = {
      plantsContainers: [{}],
      plantsContainerId: "",
      plantsContainerName: "",
      count: 0,
      plants: []
    }
  }

  reloadPlantsContainers(event) {
    let component = this;
    console.log("LOADING PLANTCONTAINERS FROM DB");

    jQuery.getJSON(`http://localhost:5000/plants_containers`, function(data) {
      console.log("loaded containerlist: " + data);
      component.setState({
        plantsContainers: data.plants_containers,
        count: data.meta.count
      });
    })
  }

  loadPlants() {
    let component = this;
    console.log("LOADING PLANTLIST FROM DB");

    jQuery.getJSON(`http://localhost:5000/plants`, function(data) {
      console.log("PLANTLIST LOADED: " + data);
      component.setState({
        plants: data.plants
      });
    })
  }

  componentDidMount() {
    console.log("ContainerList did Mount");
    this.reloadPlantsContainers();
    this.loadPlants();
  }

  renderPlantSpots(plantsContainerId, plantsContainerName){
    return<PlantSpots className="placeHolder" plantsContainerId={plantsContainerId} plantsContainerName={plantsContainerName} plants={this.state.plants}/>;
  }

  setContainerId(event) {
    console.log("new plantsContainerId:" + event.id);
    let newState = {
      plantsContainerId: event.id,
      plantsContainerName: event.name
    };
    this.setState(newState);
    console.log("plantsContainerId after setState is:" + this.state.plantsContainerId)
  }

  render(){
    return(
      <div className="plants-container-list">
        <p>Plantcontainers:</p>
          <ul>
            {
              this.state.plantsContainers.map(function(plantsContainer, i){
                return(
                    <button onClick={this.setContainerId.bind(this, plantsContainer)} >
                      {plantsContainer.name}
                    </button>
                );
              }, this)
            }
          </ul>

          <div>
            {
              this.state.plantsContainerId !== ""
                ? this.renderPlantSpots(this.state.plantsContainerId, this.state.plantsContainerName)
                : <p>Choose a plantcontainer</p>
            }
          </div>
      </div>
    );
  }
}

export default PlantsContainerList;
