import utils from '../utils/Utils'
const throttle = utils.throttle;
import dom from '../utils/DOM'

class Header {
	constructor() {
		this.$element = $('.header');

		this._scrollTop = 0;
		this._scrolled = false;
		this.visible = false;

		this.throttleFixed = throttle(this._testFixed.bind(this), 60);

		dom.$window.on('scroll', this._scrollHandler.bind(this));
		this._testFixed();
	}

	_scrollHandler() {
		this.throttleFixed();
	}

	_testScrolled() {
		if (this._scrollTop <= 0) {
			if (this._scrolled) {
				this._scrolled = false;
				this.$element.removeClass('_scrolled');
			}
		} else {
			if (this._scrolled != true) {
				this._scrolled = true;
				this.$element.addClass('_scrolled');
			}
		}
	}

	_testFixed() {
		let newScrollTop = window.pageYOffset;
		newScrollTop = newScrollTop < 0 ? 0 : newScrollTop;

		if (newScrollTop > this._scrollTop) {
			this._hide();
		} else {
			this._show();
		}

		this._scrollTop = newScrollTop;
		this._testScrolled();
	}

	_show() {
		if (this.visible != true) {
			this.visible = true;
			this.$element.addClass('_visible');
		}
	}

	_hide() {
		if (this.visible) {
			this.visible = false;
			this.$element.removeClass('_visible');
		}
	}
}

export default new Header();
