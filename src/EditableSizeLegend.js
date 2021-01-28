import {InputLabel} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import {debounce} from 'lodash';
import React from 'react';
import SizeLegend from './SizeLegend';


export class EditableSizeLegend extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {minSize: '', maxSize: ''};
        this.updateMinSize = debounce(this.updateMinSize, 500);
        this.updateMaxSize = debounce(this.updateMaxSize, 500);
    }


    onMinSizeChange = (event) => {
        this.setState({minSize: event.target.value});
        this.updateMinSize(event.target.value);
    };

    updateMinSize = (value) => {
        value = parseFloat(value);
        this.props.onOptions({minSize: value});
    };

    onMaxSizeChange = (event) => {
        this.setState({maxSize: event.target.value});
        this.updateMaxSize(event.target.value);
    };

    updateMaxSize = (value) => {
        value = parseFloat(value);
        this.props.onOptions({maxSize: value});
    };

    render() {

        const {sizeScale, textColor} = this.props;

        return <React.Fragment>
            <SizeLegend style={{display: 'block'}}
                        width={150}
                        textColor={textColor}
                        label={true} height={40}
                        scale={sizeScale}/>
            <InputLabel style={{marginTop: 16}} shrink={true} variant={"standard"}>Custom Size Range</InputLabel>
            <TextField InputLabelProps={{shrink: true}} style={{width: 90, marginRight: 4}}
                       size="small" type="text"
                       onChange={this.onMinSizeChange} label={"Min"}
                       value={this.state.minSize}/>
            <TextField InputLabelProps={{shrink: true}} style={{width: 90}} size="small" type="text"
                       onChange={this.onMaxSizeChange} label={"Max"}
                       value={this.state.maxSize}/>
        </React.Fragment>;
    }
}


