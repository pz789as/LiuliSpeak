'use strict';

import React, {
	Component
} from 'react';

import {
	StyleSheet,
	View,
	Text
} from 'react-native';

class ShowNum extends Component {
	constructor(props) {
		super(props);

		this.state = {
			select: this.props.select+1
		};
	}
	render() {
		return (
			<Text style={styles.font}>
        		{this.state.select}/{this.props.all}
      		</Text>
		);
	}
	setSelect(_index) {
		this.setState({
			select: _index+1
		});
	}
}

const styles = StyleSheet.create({
	font: {
		fontSize: 20,
		color: '#FFFFFF'
	}
});


export default ShowNum;