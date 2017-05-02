import utils from '../utils/Utils'
const throttle = utils.throttle;
import ScrollHelper from '../helpers/ScrollHelper'
import ResponsiveHelper from '../helpers/ResponsiveHelper'
import dom from '../utils/DOM'

class Menu {
	constructor() {
		this.$opener = $('[data-menu-opener]');
		this._opened = false;

		this.$menu = $('.menu');
		this._updateWidth();
		TweenMax.set(this.$menu, {x: this._menuWidth, autoAlpha: 0});

		this.$elementsToStagger = this.$menu.find('[data-menu-animate]');

		this.$opener.on('click', (e) => {
			e.preventDefault();
			this._opened ? this.close() : this._open();
		});

		this.$closer = this.$menu.find('[data-menu-closer]');
		this.$closer.click((e) => {
			e.preventDefault();
			this.close();
		});

		this.$menu.outerClick(() => {
			if (!ResponsiveHelper.isMobile()) {
				this.close();
			}
		});

		dom.$window.on('resize orientationchange', throttle(this._resizeHandler.bind(this)));
	}

	_resizeHandler() {
		this._updateWidth();
	}

	_updateWidth() {
		this._menuWidth = this.$menu.width();
	}

	_open() {
		if (this._opened) {
			return;
		}
		this._opened = true;

		this.$menu.removeClass('no-pe');

		TweenMax.set(this.$menu, {autoAlpha: 1});
		TweenMax.fromTo(this.$menu, 0.65, {x: this._menuWidth}, {x: 0});

		ScrollHelper.lock();

		TweenMax.staggerFromTo(this.$elementsToStagger, 0.5, {alpha: 0, x: -10}, {
			alpha: 1,
			x: 0,
			ease: Back.easeOut,
			delay: 0.45
		}, 0.05);
	}

	close() {
		if (!this._opened) {
			return;
		}
		this._opened = false;

		this.$menu.addClass('no-pe');

		TweenMax.to(this.$menu, 0.4, {x: this._menuWidth, onComplete: () => {
			TweenMax.set(this.$menu, {autoAlpha: 0});
		}});

		ScrollHelper.unlock();
	}
}

export default new Menu();
