import dom from '../utils/DOM'
import utils from '../utils/Utils'
const throttle = utils.throttle;
import Callback from '../classes/Callback'

export const BREAKPOINTS = {
	SM: 767
};

class ResponsiveHelper {
	constructor() {
		this.onChange = new Callback();
		dom.$window.on('resize', throttle(this._updateState.bind(this)));
		this._updateState();
	}

	_updateState() {
		let newState;
		if (dom.$window.width() < BREAKPOINTS.SM) {
			newState = 'mobile';
		} else {
			newState = 'desktop';
		}

		if (this.state != newState) {
			this.state = newState;
			this.onChange.call(newState);
		}
	}

	isMobile() {
		return this.state == 'mobile';
	}
}

export default new ResponsiveHelper();
