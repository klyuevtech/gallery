(function($){
	$.fn.fitImages = function(customOptions){

		// Merge default options with the options received from customer. Customer's options re-write detauls
		let options = $.extend({container: '.gallery', item: '.gallery__item', rowHeight: 200}, customOptions);

		// Initiate variables
		let rowItems = [],
		allImages = $.find(options.item),
		maxRowWidth = $(options.container).width(),
		totalRowWidth = 0,
		totalItemsWidth = 0;

		allImages.forEach(elem => {
			// Store original image width
			if ( ! $(elem).data('orig-width') ) {
				$(elem).data('orig-width', $(elem).width());
				$(elem).data('orig-height', $(elem).height());
			}

			// Reset height of each element to default row height
			$(elem).height(options.rowHeight);
			$(elem).width($(elem).data('orig-width') * options.rowHeight / $(elem).data('orig-height'));
console.log($(elem).height(),$(elem).data('orig-height'),$(elem).width(),$(elem).data('orig-width'));

			// Calculate margin
			let margin = (parseInt($(elem).css('marginLeft')) + parseInt($(elem).css('marginRight'))) / 2;
			totalRowWidth += ($(elem).width() + margin);
			totalItemsWidth += $(elem).width();

			if (totalRowWidth < maxRowWidth) {
				rowItems.push(elem);
			} else {
				// Substruct last element width as we do not place it.
				totalItemsWidth -= $(elem).width();

				mult = maxRowWidth / totalItemsWidth;

				rowItems.forEach(elem => {
					let margins = parseInt($(elem).css('marginLeft')) + parseInt($(elem).css('marginRight'));
					$(elem).width( Math.floor($(elem).width() * mult ) - margins);
					$(elem).height( Math.floor($(elem).height() * mult ) );
				});

				rowItems = [];
				rowItems.push(elem);

				totalRowWidth = $(elem).width() + margin;
				totalItemsWidth = $(elem).width();
			}
		});
	}

	$(window).on('load', $.fn.fitImages);
	$(window).on('resize', $.fn.fitImages);
	$(window).on('orientationchange', $.fn.fitImages);

}(jQuery));