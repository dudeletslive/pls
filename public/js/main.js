$(function() {
	/*
	* Special Checkboxes
	*/
	$('.fa-stack.checkbox[data-type="checkbox"], .fa-stack.checkbox2[data-type="checkbox"]').each(function() {
		// Checkbox Variables
		var $this = $(this),
			input = $this.attr('data-input');
		$this.click(function() {
			$this.toggleClass('checked');
			$('input[name="'+ input +'"]').trigger('click');
		})
	});
	/*
	* Special Radio Buttons
	*/
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
	/*
	* When the list changes, enable selected class on box, or disable.
	*/
	$('input[name="list"]').change(function() {
		var val = $(this).val();
		$('select[name="list"]').val(val);
		$('a[name="listOption"]').each(function() {
			$this = $(this);
			var selected = $this.attr('data-value');
			$this.parent().parent().removeClass('selected').find('a[name="listOption"]').text('Select This List').siblings('li').removeClass('selected').find('a[name="listOption"]').text('Select This List');
		});
	});
	/*
	* When select changes, uncheck the "Use All" option
	*/
	$('select[name="list"]').change(function() {
		$('input[name="list"]').prop('checked', false);
	});
	/*
	* When Insert One is active, fade in insert details one
	* Else fade out.
	*/
	$('select[name="insertOne"]').change(function() {
		if ($(this).val().indexOf('response slip') > -1) {
			$('.insertOverlayDetails#one').fadeOut();	
		} else {
			$('.insertOverlayDetails#one').fadeIn();
			$('.insertOverlayDetails#two').fadeIn();
		}
	});
	$('select[name="insertOne"]').change(function() {
		if ($(this).val().indexOf('none') > -1) {
			$('#insertTwo').addClass('hide');
			$('#insertThree').not('.hide').addClass('hide');
		} else {
			$('.hide#insertTwo').removeClass('hide');
		}
	});
	/* 
	* When Insert Two is active, fade in insert details two
	* Else fade out.
	*/
	$('select[name="insertTwo"]').change(function() {
		if($(this).val().indexOf('response slip') > -1) {
			$('.insertOverlayDetails#two').fadeOut();	
		} else {
			$('.insertOverlayDetails#two').fadeIn();
		}
	});
	$('select[name="insertTwo"]').change(function() {
		if ($(this).val().indexOf('none') > -1) {
			$('#insertThree').addClass('hide');
		} else {
			$('.hide#insertThree').removeClass('hide');
		}
	});
	/*
	 * Popup when user selects non-profit option for postage
	 */
	$('select[name="postageOption"]').change(function() {
		if ( $(this).val().indexOf('Non') > -1) {
			$('.modal').modal();
		}
	});
	/*
	* Upload S3 File to Amazon
	*/
	function s3_upload(file){
		input_element = file;
		console.log(input_element)
		//- Create Random 5 Character string to diff files
		var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    for( var i=0; i < 5; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		//- Get Filename of File
		var filename = file.value;
		var lastIndex = filename.lastIndexOf("\\");
		if (lastIndex >= 0) {
			filename = filename.substring(lastIndex + 1);
		}
		//- Get Elements for Upload
		var dataStatus = $(file).data('status'),
			dataUrl = $(file).data('url');
		var status_elem = document.getElementById(dataStatus),
			url_elem =  document.getElementById(dataUrl);
		var s3upload = new S3Upload({
			s3_object_name: text + '_' + filename,
			file_dom_selector: file.id,
			s3_sign_put_url: '/sign_s3',
			onProgress: function(percent, message) {
			    status_elem.innerHTML = 'Upload progress: ' + percent + '% ' + message;
			},
			onFinishS3Put: function(public_url) {
			    status_elem.innerHTML = 'Uploaded '+ filename;
			    url_elem.value = public_url;
			},
			onError: function(status) {
			    status_elem.innerHTML = 'Upload error: ' + status;
			}
		});
	}
	/*
	* Listen for file selection:
	*/
	(function() {
		$('input.letterFile[type="file"]').each(function() {
			$(this).change(function() {
				var $this = $(this);
				s3_upload(this);
			})
		});
	})();
});