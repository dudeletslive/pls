jQuery('document').ready(function() {
	// Special Checkboxes
	$('.fa-stack.checkbox[data-type="checkbox"], .fa-stack.checkbox2[data-type="checkbox"]').each(function() {
		// Checkbox Variables
		var $this = $(this),
			input = $this.attr('data-input');
		$this.click(function() {
			$this.toggleClass('checked');
			$('input[name="'+ input +'"]').trigger('click');
		})
	});
	// Special Radio Buttons
	$('.fa-stack.checkbox[data-type="radio"], .fa-stack.checkbox2[data-type="radio"]').each(function() {
		// Checkbox Variables
		var $this = $(this),
			input = $this.attr('data-input'),
			value = $this.attr('data-value');
		$this.click(function() {
			$('.fa-stack.checkbox[data-type="radio"], .fa-stack.checkbox2[data-type="radio"]').removeClass('checked');
			$this.addClass('checked');
			$('input[value="'+ value +'"]').trigger('click').trigger('change');
		})
	});
	$('input[name="list"]').change(function() {
		var val = $(this).val();
		$('select[name="list"]').val(val);
		$('a[name="listOption"]').each(function() {
			$this = $(this);
			var selected = $this.attr('data-value');
			$this.parent().parent().removeClass('selected').find('a[name="listOption"]').text('Select This List').siblings('li').removeClass('selected').find('a[name="listOption"]').text('Select This List');
		});
	});
	$('select[name="list"]').change(function() {
		$('input[name="list"]').prop('checked', false);
	});
});