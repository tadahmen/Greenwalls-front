import React from 'react';
import jQuery from 'jquery';
import App from './App';
import PlantSpots from './PlantSpots';

class PlantsContainerList extends React.Component {
  constructor() {
    super()

    this.state = {
      plantsContainers: [{}],
      plantsContainerId: "",
      plantsContainerName: "",
      count: 0,
      plants: [],
      timesLoaded: 0
    }
  }

  reloadPlantsContainers(event) {
    let component = this;
    console.log("LOADING PLANTCONTAINERS FROM DB");
    console.log("containerid after reload: " + component.state.plantsContainerId)

    jQuery.getJSON(`http://localhost:5000/plants_containers`, function(data) {
      console.log("loaded containerlist: " + data);
      component.setState({
        plantsContainers: data.plants_containers,
        count: data.meta.count
      })
    })
    .done(function() {
      console.log(component.state.newContainerCreated);
      if (component.state.newContainerCreated) { //true if a new container just has been created
        let containersTotal = component.state.plantsContainers.length;
        let lastContainer = component.state.plantsContainers[containersTotal-1];//the total-1 gives the position of the current last container
        console.log(">>>>>CHECK VALUE: " + containersTotal);
        component.setState({
          plantsContainerId: lastContainer.id, //to directly show 'add plantspot' button for new container
          newContainerCreated: false  //sets this value back to false
        });
      }
    });
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

  createPlantsContainer(event) {
    let component = this;
    let newPlantsContainer ={
      id: null,
      name: "new plants-container"
    };

    jQuery.ajax({
      type:'POST',
      url: `http://localhost:5000/plants_containers`,
      data: JSON.stringify({
        plants_container: newPlantsContainer
      }),
      contentType: "application/json",
      dataType: "json"
    })
    .done(function() {
      console.log("new plants container succesfully created");
      component.setState({
        newContainerCreated: true   //a switch to make reloadPlantsContainers select the new container to appear on screen
      });
      component.reloadPlantsContainers(function() {
      }); //to directly show new container in list on screen
    })
  }

  deletePlantsContainer(event) {
    console.log("DELETING PLANTS CONTAINER");
    let component = this;

    jQuery.ajax({
      type: 'DELETE',
      url: `http://localhost:5000/plants_containers/${event}.json`,
      contentType: "application/json",
      dataType: "json"
    })
    .done( function(){
      console.log("container succesfully deleted");
      console.log("CHECK id of deleted container: " + event);
      component.reloadPlantsContainers();   //plantcontainerlist on screen refreshes
      if (component.state.plantsContainerId === event) {
        component.setState(
            {plantsContainerId: ""} //if plantspots shown are that of the deleted container, then screen refreshes without them
        );
      }
    })
  }

  componentDidMount() {
    console.log("MOUNTING CONTAINERLIST");
    this.reloadPlantsContainers();
    this.loadPlants();
  }

  renderPlantSpots(plantsContainerId, plantsContainerName){
    return<PlantSpots className="placeHolder" onChange={this.reloadPlantsContainers.bind(this)} plantsContainerId={plantsContainerId} plantsContainerName={plantsContainerName} plants={this.state.plants}/>;
  }

  setContainerId(event) {
    console.log("SELECTING CONTAINER");
    console.log("new plantsContainerId:" + event.id);
    //let newState =
    this.setState({
      plantsContainerId: event.id,
      plantsContainerName: event.name
    })
      console.log("this.state.plantsContainerId after setState is:" + component.state.plantsContainerId)
  }

  render(){
    return(
      <div className="plantscontainer-list">
        <p>Plantcontainers:</p>
        {
          this.state.plantsContainers.map(function(plantsContainer, i){

            return(
              <span className="wrapper">
                <button className="plantsContainer" onClick={this.setContainerId.bind(this, plantsContainer)}>
                  <span className="containerName"> {plantsContainer.name} </span>
                </button>
                <button className="deleteContainer" onClick={this.deletePlantsContainer.bind(this, plantsContainer.id)}>
                  <span className="deleteSymbol"> x </span>
                </button>
              </span>
            );
          }, this)

        }
        <button className="add-container" onClick={this.createPlantsContainer.bind(this)}>
          <span className="addContainer-symbol"> + </span>
        </button>
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
