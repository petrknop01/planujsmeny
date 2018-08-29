import variable from './../variables/platform';

export default (variables = variable) => {
	const inputTheme = {
		'.multiline': {
			height: null,
		},
		height: variables.inputHeightBase,
		color: variables.inputColor,
		paddingLeft: 10,
		paddingRight: 10,
		flex: 1,
		fontSize: variables.inputFontSize,
		backgroundColor: "#EEE",
		borderRadius: variable.borderRadiusBase
	};

	return inputTheme;
};
