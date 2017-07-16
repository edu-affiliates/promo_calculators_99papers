'use strict';

import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

class CalculatorSmallTitle extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="calc-sm-title-wrap">
                <div className="calc-sm-title">
                    <span>{this.props.discount * 100}% </span>
                    <span>OFF YOUR FIRST ORDER. Limited Time!</span>
                </div>
            </div>
        )
    }
}

CalculatorSmallTitle.propTypes = {
  discount: PropTypes.number.isRequired,
};

//container to match redux state to component props and dispatch redux actions to callback props
const mapStateToProps = reduxState => {
  return {
        discount: reduxState.discount,
    }
};

const mapDispatchToProps = dispatch => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(CalculatorSmallTitle);
