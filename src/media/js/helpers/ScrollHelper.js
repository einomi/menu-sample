import dom from '../utils/DOM'
import utils from '../utils/Utils'

class ScrollHelper {
	constructor() {
		this.$scrollTarget = dom.$window;
		this.$lockTarget = dom.$body;

		this.$widthLockTarget = dom.$body;

		this._scrollHandlers = [];

		this.locked = false;
		var self = this;

		dom.$window.keydown(function(e) {
			if(!self.locked){
				return;
			}
			var keyCode = e.keyCode || e.which;
			if (keyCode == 9) {
				var $target = $(e.target);
				if ($target.is(self.$scrollTarget)) {
					e.preventDefault();
				} else if(self.$scrollTarget.has($target).length > 0){
					e.preventDefault();
				}
			}
		});

		$('[data-scroll-to]').mousedown(function( e ){
			e.preventDefault();

			var scrollTo = $(this).attr('data-scroll-to');

			self.scrollTo( isNaN(parseInt(scrollTo)) ? scrollTo : parseInt(scrollTo) );
		});
	}

	lock() {
		this.locked = true;

		var startWidth = this.$lockTarget.width();

		this.$lockTarget.css('overflow', 'hidden').attr('tabindex', '-1').addClass('locked');

		var endWidth = this.$lockTarget.width();

		this.$widthLockTarget.css({
			paddingRight: (endWidth - startWidth) + 'px',
		});
	}

	unlock() {
		this.locked = false;

		this.$lockTarget.css('overflow', '').attr('tabindex', '').removeAttr('tabindex').removeClass('locked');

		this.$widthLockTarget.css({
			paddingRight: '0px',
		});
	}

	scrollTo(value, time, completeHandler, skipOnScrolling, immediate) {
		if(this._busy){
			if(skipOnScrolling){
				return;
			}
		}
		if(isNaN( Number(value) ) ){
			var $target = $(value).first();
			if(!$target.length){
				return;
			}
			value = $target.offset().top;
		}

		value = value < 0 ? 0 : value;

		var maxScroll = dom.$document.height() - dom.$window.height();
		value = value > maxScroll ? maxScroll : value;

		if(typeof time != 'number'){
			var current = this.$scrollTarget.scrollTop();
			var distance = Math.abs(current - value);
			time = distance / 1000;
			time = time < 0.25 ? 0.25 : time;
			time = time > 1.3 ? 1.3 : time;
		}
		if(Math.abs(this.$scrollTarget.scrollTop() - value) <= 20){
			time = 0.1;
		}

		this._busy = true;

		var self = this;
		if (immediate) {
			dom.$document.on('ready', () => {

				TweenMax.set( this.$scrollTarget,{ scrollTo: { y : value, autoKill:false } });
			});
		}
		else {
			TweenMax.to( this.$scrollTarget, time, { scrollTo: { y : value, autoKill:false }, ease: time < 0.75 ? Power3.easeOut : Circ.easeInOut, onComplete: function(){
				self._busy = false;
				if( typeof completeHandler == 'function' ){
					completeHandler();
				}
			} } );
		}
	}
}

export default new ScrollHelper();
