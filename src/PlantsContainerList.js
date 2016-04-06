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
      count: 0
    }
  }

  reloadPlantsContainers(event) {
    let component = this;

    jQuery.getJSON(`http://localhost:5000/plants_containers`, function(data) {
      console.log(data);
      component.setState({
        plantsContainers: data.plants_containers,
        count: data.meta.count
      });
    })
  }

  componentDidMount() {
    console.log("didMount");
    this.reloadPlantsContainers();
  }

  displayContainer(event) {
    console.log("event is plantsContainerId:" + event.id);
    this.setState({
      plantsContainerId: event.id,
      plantsContainerName: event.name
    });
    console.log("plantsContainerId is:" + this.state.plantsContainerId)
  }

  render(){
    return(
      <div>
        <p>plantcontainers:</p>
        <p>plantsContainerId is: {this.state.plantsContainerId}</p>
          <ul>
            {
              this.state.plantsContainers.map(function(plantsContainer, i){
                return(
                    <button onClick={this.displayContainer.bind(this, plantsContainer)} >
                      {plantsContainer.name}
                    </button>
                );
              }, this)
            }
          </ul>
          <p>plantsContainerId is: {this.state.plantsContainerId}</p>
          <div>
            {
              this.state.plantsContainerId !== "" ? <PlantSpots className="placeHolder" plantsContainerId={this.state.plantsContainerId} plantsContainerName={this.state.plantsContainerName}/>
              : <p>Choose a plantcontainer</p>
            }
          </div>
      </div>
    );
  }
}

export default PlantsContainerList;
