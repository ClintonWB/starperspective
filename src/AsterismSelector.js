import React, {Component} from 'react';
import StarCanvas from './StarCanvas.js';
import Asterisms from './asterisms.json';

class AsterismSelector extends Component {

  constructor(props) {
        super(props);
        this.state = {
          asterism_surd: "BDr",
        }
  }


  componentDidMount(){
  }

  onChange(evt){
    this.setState({asterism_surd:evt.target.value})
  }

  render(){
    var surd_dict = {};
    var opt_groups = Object.keys(Asterisms).map(function(opt_group){
      var options = [];
      Object.keys(Asterisms[opt_group]).forEach(function(category){
        options.push(...Object.keys(Asterisms[opt_group][category])
          .map(function(surd){
            var asterism = Asterisms[opt_group][category][surd];
            surd_dict[surd] = asterism;
            var name = asterism["name"];
            return <option value={surd} var={surd} key={surd}>{name}</option>;
          })
      )})

      return <optgroup label={opt_group} key={opt_group}>
              {options}
              </optgroup>
      });

      return (
        <div>
        <select defaultValue={this.state.asterism_surd} onChange={this.onChange.bind(this)}>
        {opt_groups}
        </select>
        <StarCanvas starData={surd_dict[this.state.asterism_surd]} />
        </div>
        );
  }
}

export default AsterismSelector;
