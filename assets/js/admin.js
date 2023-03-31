jQuery(function($){
    
    function initPage() {
        if ((typeof wpwoof_current_page !== 'undefined')) {
            
            switch (wpwoof_current_page) {
                case 'dashboard':
                    if(typeof wpwoof_editorsId4init !== 'undefined' && wpwoof_editorsId4init.length) {
                        for (var i = 0; i < wpwoof_editorsId4init.length; i++) {
                            initWPEditor(wpwoof_editorsId4init[i]);
                        }
                    }
                    $(document).on('change', 'textarea[id^=wpwoof-editor-]', function() {
                       $('input[name="extra['+$(this).attr('id').substring(14)+'][custom_value]"').val($(this).val()).change();
                   });
                    setInterval(() => WPEditor_detectChanges(), 2000);
                    break;
                case 'editProduct':
                    $(document).on('submit', "form#post", prepareCustomEditorToSubmit);
                    $('body').on('woocommerce_variations_save_variations_button', prepareCustomEditorToSubmit);
                    $('body').on('wc-enhanced-select-init', function () {
                        if (typeof wpwoof_editorsId4initVar !== 'undefined' && wpwoof_editorsId4initVar.length) {
                            for (var loop = 0; loop < wpwoof_editorsId4initVar.length; loop++) {
                                if (wpwoof_editorsId4initVar[loop].length) {
                                    for (var i = 0; i <wpwoof_editorsId4initVar[loop].length; i++) {
                                        initWPEditor(wpwoof_editorsId4initVar[loop][i]);
                                    }
                                }
                            }
                        }
                    });
                    if (typeof wpwoof_editorsId4init !== 'undefined' && wpwoof_editorsId4init.length) {
                        for (var i = 0; i < wpwoof_editorsId4init.length; i++) {
                            initWPEditor(wpwoof_editorsId4init[i]);
                        }
                    }
                    break;
                default:
                    console.log(`Wrong wpwoof_current_page: ${wpwoof_current_page}.`);
            }

        }
    }
    initPage();
    
    function initWPEditor(id) {
        if ($('#wpwoof-editor-' + id).length) {
            id = 'wpwoof-editor-' + id;
        }
        if (typeof tinyMCE.editors[id] !== 'undefined') {
            wp.editor.remove(id);
        }
        
        wp.editor.initialize(id, {
            tinymce: {
                wpautop: true,
                plugins: 'charmap colorpicker hr lists paste tabfocus textcolor fullscreen wordpress wpautoresize wpeditimage wpemoji wpgallery wplink wptextpattern',
                toolbar1: 'formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,wp_adv,listbuttons',
                toolbar2: 'styleselect,strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help',
                textarea_rows: 20 
            },
            quicktags: {buttons: 'strong,em,link,block,del,ins,img,ul,ol,li,code,more,close'},
            mediaButtons: false,
        });
    }
    function WPEditor_detectChanges() {
        if(tinyMCE.editors.length) {
            for (var i = 0; i < tinyMCE.editors.length; i++) {
                if(tinyMCE.editors[i].isDirty()) {
                    tinyMCE.triggerSave();
                    $('#'+tinyMCE.editors[i].id).change();
                }
            }
        }
    }
    function prepareCustomEditorToSubmit() {
        if (tinyMCE.editors.length) {
            tinyMCE.triggerSave();
            for (var i = 0; i < tinyMCE.editors.length; i++) { 
                var fullID = tinyMCE.editors[i].id;
                if(fullID.startsWith('wpwoof-editor-')) {
                    var re = /wpwoof-editor-(\d)_/;
                    var loopArray = re.exec(fullID);
                    if (loopArray) {
                        $('input[name="wpfoof-box-media[extra]['+loopArray[1]+']['+fullID.replace('wpwoof-editor-'+loopArray[1]+'_','')+'][value]"').val($('#'+fullID).val());
                    } else {
                        $('input[name="wpfoof-box-media[extra]['+fullID.replace('wpwoof-editor-','')+'][value]"').val($('#'+fullID).val());
                    }
                    
                }
            }
                    
        }

    }
    $(document).on('click', 'a.wpwoof-button-forlist:disabled', function(e) {
        return false;
    });
    
    function Wpwoof_getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return null;
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    $.fn.wpwoofSwicher = function (feed_id,status){

        $.post(ajaxurl,{'action':'set_disable_status','set_disable_status':(status)? 0 : 1,'feed_id':feed_id},function(answ){
            if(answ.status && answ.status == "OK"){
                console.log('ok');

            }
        },"JSON");
    }

    $.fn.saveWPWoofParam = function(data,cb){
        //console.log("senddata:",data);
        if(typeof data["action"] != "undefined" && data["action"]=='set_wpwoof_shedule') {
            
            data["wpwoof_schedule"] = $("select[name='wpwoof_schedule']").val();
            data["wpwoof_schedule_from"] = $("input[name='wpwoof_schedule_from']").val();
            
        }
        if(data) $.post(ajaxurl,data,function(answ){
            //console.log("answ:",answ);
            if(cb) cb(answ);
        }).fail(function(xhr, status, error ) {
            console.log( "saveWPWoofParam error:",error,"xhr:",xhr,"status:",status );
            if(cb) cb(error);
        });
    }



    $.fn.wpwoofOpenCloseFieldList = function(sList,isShow){
        if(isShow) jQuery('#id'+sList+'Fields').show();
        else jQuery('#id'+sList+'Fields').hide();
    }

    function  wpwoofShowModal(){
        $('#IDwpwoof-myModal').css({'left' : 'calc(5% + ' + $('#adminmenuwrap').outerWidth() + 'px)'});
        $('#IDwpwoof-myModal').show();
        setTimeout(function(){
            $('#IDwpwoof-myModal').hide();
        },30000);
    }

    var menutab = Wpwoof_getParameterByName('tab'); 
    var edittab = Wpwoof_getParameterByName('edit');

    if( menutab == null || menutab < 0 )
        menutab = 0;
    if( edittab == null ) {
        //toggle tab content
        $('#idWpWoofAddNewFeed').on('click', function() {
//                console.log("HIDER ");
                $('.wpwoof-settings-panel.first').hide();
                $('.wpwoof-settings-panel.second').show();
                return false;
            });
    }

    $(document).on('click', '.wpwoof-open-popup', function(event) {
        event.preventDefault();
        $(this).parents('.wpwoof-open-popup-wrap').find('.wpwoof-popup-wrap').show();
    });

    $(document).on('click', '.wpwoof-popup-close, .wpwoof-popup-done', function(){
        $(this).parents('.wpwoof-popup-wrap').hide();	
    });



    function sendWPWOOForm(){
        wpwoofShowModal();
        $('.CLSwpwoofSubmit').toggleClass('wpwoof-loader');
        $('.CLSwpwoofSubmit').toggleClass('CLSwpwoofSubmit');
        var formhref = $('#wpwoof-addfeed').attr('action');
        $.fn.saveWPWoofParam($('#wpwoof-addfeed').serialize()+"&wpwoof-addfeed-submit=ajax&action=wpwoof-addfeed-submit", function(answ){
            $('.CLSwpwoofSubmit').toggleClass('wpwoof-loader');
            $('.CLSwpwoofSubmit').toggleClass('CLSwpwoofSubmit');
            window.location.href=formhref;
        });
        return false;
    }
    function wpFindInArray(arr,val){
        if(typeof arr === 'object'){
            for(var i in arr){
                    if(arr[i]==val)return i; 
            }
        }
        return -1;
    }

    $(document).on('click', '.CLSwpwoofSubmit', function(e){     /*#wpwoof-addfeed*/
        //console.log('TYT.CLSwpwoofSubmit');
        var feed_name = ($('#idFeedName').val()).trim();
        var regexEmpty = /^\s+$/;
        var regexTitle = /[!\!@#$%^&*()+\=\[\]{};':"\\|,<>\/?]/;
        if( feed_name == '') {
            e.preventDefault();
            alert('The feed name can not be empty.');
            $('html, body').animate({
                scrollTop: ($('#idFeedName').offset().top -150)
            }, 200);
            $('#idFeedName').focus();
            return false;
        } else if( regexTitle.test(feed_name) ) {
            e.preventDefault();	
            alert('A Feed Name should not contain special characters. The following special characters are not allowed: " ! @ # $ % ^ & * ( ) + \\ / = [ ] { } ; \' : " , < > ? ".');
            $('html, body').animate({
                scrollTop: ($('#idFeedName').offset().top -150)
            }, 200);
            $('#idFeedName').focus();
            return false;
        } else if(feed_name.length<3 || feed_name.length>100 ) {
            e.preventDefault();	
            alert('The feed name should contain at least 3 characters but less than 100 characters.');
            $('html, body').animate({
                scrollTop: ($('#idFeedName').offset().top -150)
            }, 200);
            $('#idFeedName').focus();
            return false;
        }else if( $('#IDtax_countries').length>0 && $('#IDtax_countries').is(":visible") && $('#IDtax_countries').val()=="" ){
            e.preventDefault();
            alert('Please define “apply tax for” under Price and Tax settings.');
            $('html, body').animate({
                scrollTop: ($('#IDtax_countries').offset().top -150)
            }, 200);
            $('#IDtax_countries').focus();
            return false;
        } if($('#feed_category_all').is(':checked')){
            $('#wpwoof-popup-categories input').each(function(){
                if($(this).attr('id')!='feed_category_all'){                   
                    $(this).remove();
                }
            });
        } else if ($("select[name='feed_use_lang']").length && $("select[name='feed_use_lang']").val()!='all') {
            let lang = $("select[name='feed_use_lang']").val();
            $('#wpwoof-popup-categories li.language_all:not(.language_'+lang+')').each(function () {
                $(this).remove();
            });
        }
        
        if ($('#ID-feed_type').val()=='googleReviews' && !jQuery('#feed_remove_variations').prop('checked')) {
            jQuery('#feed_remove_variations').prop('checked',true)
        }

        if( $('input[name=edit_feed]').length  && $('input[name=edit_feed]')!="" && feed_name==$('input[name=old_feed_name]').val() ){
                sendWPWOOForm();
        }else{
                $.fn.saveWPWoofParam({'action':'check_feed_name','check_feed_name':feed_name},function(answ){
                    //console.log("CHECKED STATUS:",answ);
                    if(answ.status && answ.status == "OK"){
                            sendWPWOOForm();
                    } else {
                        var key=1;
                        while( wpFindInArray(answ,feed_name + "-" + key) !=-1 ) key=key*1+1;
                        feed_name = feed_name + "-" + key;
                        $('#idFeedName').val(feed_name);
                           sendWPWOOForm();
                        }
                });
        }
         return false;

    });

    $(document).on('click', '#wpwoof-hide-additional', function(){
        $('#wpwoof-additionalfield-wrap').toggleClass('wpwoof-additional-hide');
        if( $('#wpwoof-additionalfield-wrap').hasClass('wpwoof-additional-hide') ) {
            $(this).text('Show Additional Attributes');
        } else {
            $(this).text('Hide Additional Attributes');
        }
    });

    $(document).on('click', '#wpwoof-popup-categories li input.feed_category', function(e) {
        var cat_id = $(this).attr('id') || '';
        if( cat_id != 'feed_category_all' ) {
            var allchecked = true;
            let lang_selector = ($("select[name='feed_use_lang']").length)?".language_"+$("select[name='feed_use_lang']").val():"";
            $('#wpwoof-popup-categories li'+lang_selector+' input.feed_category').each(function(index, el) {
                var cat_id = $(this).attr('id') || '';
                if( cat_id != 'feed_category_all' && $(this).prop('checked') == false )
                    allchecked = false;	
            });

            if( !allchecked ) {
                $('#feed_category_all').prop('checked', false);
            } else {
                $('#feed_category_all').prop('checked', true);
            }
        }
    });

    $(document).on('click', '#feed_category_all', function(e) {
        var tick = $(this).prop('checked');
        let lang_selector = ($("select[name='feed_use_lang']").length)?".language_"+$("select[name='feed_use_lang']").val():"";
        $('#wpwoof-popup-categories li'+lang_selector+' input.feed_category').prop('checked', tick);
    });

    $(document).on('click', '#feed_check_all_additional', function(e) {
        var tick = $(this).prop('checked');
        $('input.wpwoof-field-additional').prop('checked', tick);
    });

    $(document).on('change', 'select.wpwoof_mapping_option', function(){
        if( $(this).val() == 'use_custom_attribute' ) {
            if( !$(this).next('input' ).hasClass('wpwoof_mapping_attribute') ) {
                var name = $(this).attr('name');
                name = name.toString();
                name = name.replace('[value]', '[custom_attribute]');
                var html = '<input type="text" name="'+name+'" value="" class="wpwoof_mapping_attribute" />';
                $(this).after(html);
            }
        } else {
            if( $(this).next('input' ).hasClass('wpwoof_mapping_attribute') ) {
                $(this).next('input' ).remove();
            }
        }
    });
    $('body').on('click',function( event ) {
        if( $('#IDwpwoof-myModal').is( ":visible" ) ){   
            $('#IDwpwoof-myModal').hide();
        }
    });    
    
    $('span.wpwoof-close').on('click',function(){
        $('#IDwpwoof-myModal').hide(); 
    });
   $('a.regenerate').on('click',function(){
        
        if( $(this).is(':disabled') ) return false;       
        sendRegeneration( $(this).attr('href') ); 
        var elmID = $(this).attr('id');
        if(elmID){
             elmID=elmID.substring(0, elmID.length-1);      
             wpwoofHideButtons($('#'+elmID).data('feedid'),-29);
//             wpwoofShowModal();
        }        
        //$(this).find('span').html( ' in progress ');
        return false;
    });
   function sendRegeneration(url){
        if(url){
            $.post(url); 
        }       
    }
   function wpwoofShowButtons(feedID) {
         
         $('#idTr'+feedID+' a').removeAttr('disabled');
         $('#idTr'+feedID+' a.wpfooalarm').remove();
         $('#wpwoof_status_'+feedID).hide();
         if( $('#spinner'+feedID).length ) $('#spinner'+feedID).hide();
    }
   function wpwoofHideButtons(feedID, marginleft,total) {
        $('#idTr'+feedID+' a').attr('disabled',true);
        $("#wpwoof_img_"+feedID).css('margin-left',marginleft);
        if(total) $("#wpwoof_img_"+feedID).attr('title','generated - ' + Math.round( total ) + '%');
        $('#wpwoof_status_'+feedID).show(); 
        if( $('#spinner'+feedID).length ) $('#spinner'+feedID).show();
   }
   function checkFeedsStatus(){
       var feedsIdsOnPage = [];
       $.each($('div.wpwoof_statusbar'), function( index, elm ) {
           feedsIdsOnPage.push($(elm).data('feedid'));
       });
       if (!feedsIdsOnPage.length) return false;
       $.fn.saveWPWoofParam({'action':'wpwoof_status','wpwoof_status':'get','feedids':feedsIdsOnPage},function(data){
            var starded = new Array();
            $.each($('div.wpwoof_statusbar'), function( index, elm ) {
                var marginleft=-2; 
                var total = 100;
                var hideButtons = false;
                var feedId = $(elm).data('feedid');
//                    if(starded.indexOf(data[i]['feed_id'])==-1){
//                        starded.push(data[i]['feed_id']);
//                        if($('#'+ data[i]['option_name']+'a').length) sendRegeneration( $('#'+ data[i]['option_name']+'a').attr('href') );
//                    }
                    if( typeof data[feedId] != "undefined" ){
                        if (data[feedId]['processed'] != -1) {
                            var prods = data[feedId]['total'];  
                            total = prods ? 100.0/prods * data[feedId]['processed']*1.0 : 100;
                            marginleft+=-29 + Math.round( 3 *  total/10 ); 
                        } else {
                            marginleft=-29;
                            total = 0;
                        }
                        if( typeof data[feedId]['timestr'] != "undefined" ){
                            $('tr#idTr'+feedId+' td.column-feeddate').html(data[feedId]['timestr']);
                        }
                        if( typeof data[feedId]['total'] != "undefined" && data[feedId]['total'] ){
                            $('tr#idTr'+feedId+' td.column-feedproducts').html(data[feedId]['total']);
                        }
                        if ((data[feedId]['processed'] != 0 && data[feedId]['total'] != 0) || data[feedId]['processed'] == -1 ) hideButtons = true;
                    }

                if(hideButtons){
                    wpwoofHideButtons(feedId,marginleft,total);                   
                }else{
                    //тут включаем все , фид готов
                    wpwoofShowButtons(feedId);
                }
            });
        });
       setTimeout(checkFeedsStatus,47000);
    }
    $.each($('div.wpwoof_statusbar'), function( index, elm ) {
        wpwoofHideButtons($(elm).data('feedid'),-30);
    });
    checkFeedsStatus();
    $.fn.toggleFeedField = function (sClass){
        //console.log('toggle:'+sClass);
        $('[class|="stl"],[class*=" stl-"]').hide();
        $('.stl-'+sClass).show();
		if ($('#ID-feed_type').val() == 'google' && $('#inventory').attr('data-new') == 1)
			$('#inventory').prop('checked', false);
        /* showSKUorID();*/
    }
    $.fn.initGoogleTaxonomy = function (elm,cats, acturl) {
        elm = elm ? elm : '.wpwoof_google_category';


        WPWOOFpreselect = cats ? cats : WPWOOFpreselect;
        WPWOOFtaxSrc = acturl ? acturl :  WPWOOFtaxSrc;



            var WPWOOFoptions = {
                empty_value: 'null',
                indexed: true,  // the data in tree is indexed by values (ids), not by labels
                on_each_change: WPWOOFtaxSrc,//'<?php echo $taxSrc; ?>', // this file will be called with 'id' parameter, JSON data must be returned
                choose: function (level) {
                    if (level < 1)
                        return 'Select Main Category';
                    else
                        return 'Select Sub Category';
                },
                loading_image: WPWOOFspiner, //'<?php echo home_url( '/wp-includes/images/wpspin.gif');?>',
                get_parent_value_if_empty: true,
                set_value_on: 'each',
                preselect: {'wpwoof_google_category': WPWOOFpreselect} /* <?php echo $preselect; ?> */
            };

            var WPWOOFdisplayParents = function () {
                var labels = []; // initialize array
                var IDs = []; // initialize array
                $(this).siblings('select') // find all select
                    .find(':selected') // and their current options
                    .each(function () {
                        if ($(this).text() != 'Select Main Category' && $(this).text() != 'Select Sub Category') {
                            if ($(this).val() != '') {
                                labels.push($(this).text());
                                IDs.push($(this).val());
                            }
                        }
                    }); // and add option text to array
                var elmparent = $(this).parent();
                if (elmparent.children('div [id^=\'feed_google_text_category_\']').length > 0) {
                    elmparent.children('div [id^=\'feed_google_text_category\']').text(labels.join(' > '));
                }
                elmparent.children('input[name^=\'feed_google_category\']').val(labels.join(' > '));
                elmparent.children('input[name^=\'feed_google_category_id\']').val(IDs.join(','));

            }
            if ($(elm).length) {

                $.getJSON(WPWOOFtaxSrc, function (tree) { // '<?php echo $taxSrc; ?>' initialize the tree by loading the file first
                    $(elm).optionTree(tree, WPWOOFoptions).change(WPWOOFdisplayParents);
                });
            }
        }
    if( $('#ID-feed_type').length ){ /*show and hide fields for feed type */
        $('[class|="stl"],[class*=" stl-"]').hide();
        $(".stl-"+$('#ID-feed_type').val()).show();
    }
    var switches = document.querySelectorAll('input[type="checkbox"].ios-switch');
    for (var i = 0, sw; sw = switches[i++];) {
        var divSwitcher = $(sw).parent().find('div.switch');
        if(divSwitcher.length==0) {
            var div = document.createElement('div');
            div.className = 'switch';
            sw.parentNode.insertBefore(div, sw.nextSibling);
        }
    }
    
    //custom value field
    $(document).on('change',"td.input-cell div.fstSingleMode select", function () {
        let fieldname = this.name.substring(6,this.name.length-8);
        if (this.value == 'custom_value') {
            $("[name='" + this.name.replace("[value]","[custom_value]") + "']").show();
            wp.editor.remove('wpwoof-editor-' + fieldname);
            $('textarea#wpwoof-editor-' + fieldname).hide();
        } else if((this.value == 'custom_value_editor')) {
            $('textarea#wpwoof-editor-' + fieldname).show();
            $('textarea#wpwoof-editor-' + fieldname).val($("[name='" + this.name.replace("[value]","[custom_value]") + "']").val());
            initWPEditor(fieldname);
            $("[name='" + this.name.replace("[value]","[custom_value]") + "']").hide();
        } else {
            $("[name='" + this.name.replace("[value]","[custom_value]") + "']").hide();
            wp.editor.remove('wpwoof-editor-' + fieldname);
            $('textarea#wpwoof-editor-' + fieldname).hide();
        }
    });
    $(document).on('click',"input.remove-extra-field-btn", function () {
        $(this).parent().parent().remove();
        storeWpWoofdata();
    });
    $(document).on('click',"input.remove-extra-field-product-btn", function () {
        $(this).closest('div').remove();
    });
    $(document).on('change',"[name^='extra[']", function () {
        storeWpWoofdata();
    });
    $(document).on('click',"input#add-extra-field-btn", function () {
        let extraRow =  $('table#wpwoof-def-extra-row tr').clone();
        let tagName =  $('#extraFieldList').val().replace('wpwoofattr_','');
        if (tagName!=="custom_extra_field") {
            $('input[name="wpwoof-def[custom_tag_name]"]',extraRow).remove();
            $('input[type="checkbox"]',extraRow).remove();
            $('label',extraRow).remove();
            $('b#wpwoof-def-title',extraRow).html(tagName+":");
            $('div.extra-link-2-wrapper-dashboard',extraRow).html(wpwoof_help_links[tagName]);
            if (typeof wpwoof_select_values[tagName] !== 'undefined') {
                $('textarea#wpwoof-editor-def',extraRow).remove();
                $('option[value="custom_value_editor"]',extraRow).remove();
                $('input[name="wpwoof-def[custom_value]"]',extraRow).remove();
                $.each(wpwoof_select_values[tagName], function (i, item) {
                    $('select[name="wpwoof-def[custom_value]"]',extraRow).append($('<option>', {
                        value: i,
                        text : item 
                    }));
                });
            } else {
                $('select[name="wpwoof-def[custom_value]"]',extraRow).remove();
            }
        } else {
            $('b#wpwoof-def-title',extraRow).remove();
            $('select[name$="[custom_value]"]',extraRow).remove();
            $('div.extra-link-2-wrapper-dashboard',extraRow).remove();
            let maxExtraFieldNumber = 0;
            $('[name^="extra[custom-extra-field-"][name$="][custom_tag_name]').each(function() {
                var regex = /extra\[custom-extra-field-(\d*)]/;
                 if ((curArr = regex.exec($( this ).attr( "name" ))) !== null) {
                     curId = parseInt(curArr[1]);
                     if (curId >= maxExtraFieldNumber) maxExtraFieldNumber  = curId+1;
                 }
                 
            });
            tagName = 'custom-extra-field-'+maxExtraFieldNumber;
        }
        $('[name^="wpwoof-def"]',extraRow).each(function() {
            let fullTagName = $( this ).attr( "name" ).replace('wpwoof-def',"extra["+tagName+"]");
           $('[for="'+$( this ).attr( "name" )+'"]',extraRow).attr( "for", fullTagName);
           $( this ).attr( "id", fullTagName);
           $( this ).attr( "name", fullTagName);
           
           if($( this ).is('select[name$="[value]"')) $( this ).fastselect();
          });
          $('textarea#wpwoof-editor-def',extraRow).attr( "id", "wpwoof-editor-"+tagName);
        $(extraRow).insertBefore('tr#tr-befor-add-new-field');
        
        
    });
    $(document).on('click',"input#add-extra-field-product-btn", function () {
        let loop = $(this).data( "loop" );
        let loopStr = (typeof loop === 'undefined') ? "": "["+loop+"]";
        let loopStrEditor = (typeof loop === 'undefined') ? "":loop+'_';
        var div = $(this).parent().parent();
        let div_product = div.parent( ".product-catalog-feed-pro" );
        if (div_product.length === 0) div_product = div.parent( "#woof_add_extra_fields" );
        let rowWrapper = $("<div>");
        let tagName =  $('#extraFieldList',div).val().replace('wpwoofattr_','');
        let needEditor = tagName=="custom_extra_field_editor";
        let row = $("<p>", { class: "form-field custom_field_type add-extra-fields", style: (needEditor && typeof loop !== 'undefined'?'display: inline;':'')});
        if (tagName=="custom_extra_field" || tagName=="custom_extra_field_editor") {
            let maxExtraFieldNumber = 0;
            $('[name^="wpfoof-box-media[extra]'+loopStr+'[custom-extra-field-"][name$="][custom_tag_name]"').each(function() {
                var regex = /\[custom-extra-field-(\d*)]/;
                 if ((curArr = regex.exec($( this ).attr( "name" ))) !== null) {
                     curId = parseInt(curArr[1]);
                     if (curId >= maxExtraFieldNumber) maxExtraFieldNumber  = curId+1;
                 }
                 
            });
            tagName = 'custom-extra-field-'+maxExtraFieldNumber;
            row.append($("<input>", { name: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][custom_tag_name]",style:"margin-left: -150px;width: 140px;", type: "text", class: (needEditor && typeof loop !== 'undefined'?"":"catalog-pro-custom-extra-field")}));
            if(needEditor) {
                row.append($("<textarea>", { placeholder:"Custom value",class:"short wc_input_"+tagName, id: "wpwoof-editor-"+loopStrEditor+tagName}));
                row.append($("<input>", { name: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][type]", value:'editor' ,type: "hidden"}));
            } 
            row.append($("<input>", { name: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][value]",placeholder:"Custom value",class:"short wc_input_"+tagName, type: needEditor?"hidden":"text"}));
            
            row.append($("<input>", { type:"button", class:"button remove-extra-field-product-btn",value:"remove"}));
//            row.append($("<span>", { class:"extra-link-2-wrapper"}).html(wpwoof_help_links[tagName]));
           
            var $linkWrap = $('<span>', {class: "extra-link-wrapper"});

            $linkWrap.append($("<input>", { id: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][facebook]", name: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][facebook]",type:"checkbox",checked:"checked"}));
            $linkWrap.append($("<label>", {for: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][facebook]"}).html('Facebook'));
            $linkWrap.append($("<input>", { id: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][google]", name: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][google]",type:"checkbox",checked:"checked"}));
            $linkWrap.append($("<label>", {for: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][google]"}).html('Google Merchant'));
            $linkWrap.append($("<input>", { id: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][adsensecustom]", name: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][adsensecustom]",type:"checkbox",checked:"checked"}));
            $linkWrap.append($("<label>", {for: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][adsensecustom]"}).html('Google Custom Remarketing'));
            $linkWrap.append($("<input>", { id: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][pinterest]", name: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][pinterest]",type:"checkbox",checked:"checked"}));
            $linkWrap.append($("<label>", {for: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][pinterest]"}).html('Pinterest'));
            $linkWrap.append($("<input>", { id: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][tiktok]", name: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][tiktok]",type:"checkbox",checked:"checked"}));
            $linkWrap.append($("<label>", {for: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][tiktok]"}).html('TikTok'));
            $linkWrap.append($("<br>"));
            $linkWrap.append($("<input>", { id: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][mapping]", name: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][mapping]",type:"checkbox",checked:"checked"}));
            $linkWrap.append($("<label>", {for: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][feed_type][mapping]"}).html('Use for mapping (limited to 100 chars if mapped to custom labels)'));
            row.append($linkWrap);
        } else {
            row.append($("<label>").html(tagName+":"));
            if (typeof wpwoof_select_values[tagName] !== 'undefined') {
                $select = $("<select>", { name: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][value]",class:"select short"});
                $.each(wpwoof_select_values[tagName], function (i, item) {
                    $($select).append($('<option>', {
                        value: i,
                        text : item 
                    }));
                });
                row.append($select);
            } else {
                row.append($("<input>", { name: "wpfoof-box-media[extra]"+loopStr+"["+tagName+"][value]",placeholder:"Custom value",class:"short wc_input_"+tagName, type: "text"}));
            }
            row.append($("<input>", { type:"button", class:"button remove-extra-field-product-btn",value:"remove"}));
			row.append($("<span>", { class:"extra-link-2-wrapper"}).html(wpwoof_help_links[tagName]));
            if (tagName=='installmentmonths') {
                //row.append($("<br>"));
                let $w1 = $("<p>", {class: "installmentamount-wrapper form-field custom_field_type add-extra-fields"});
                $w1.append($("<label>").html("installmentamount:"));
                $w1.append($("<input>", { name: "wpfoof-box-media[extra]"+loopStr+"[installmentamount][value]",placeholder:"Custom value",class:"short wc_input_installmentamount", type: "text"}));
                rowWrapper.append(row);
                rowWrapper.append($w1);
            }
        }
		if (tagName != 'installmentmonths') {
			rowWrapper.append(row);
		}
        $(rowWrapper).insertBefore($('hr#hr-befor-add-new-field',div_product));
        if(needEditor) {
            initWPEditor(loopStrEditor+tagName);
        }
        
    });

	$(document).ready(function(){
		$('#woof_add_extra_fields').closest('.panel-wrap').css('overflow', 'visible');
	});
});

function loadTaxomomy(elem, onchange ) {
    if(!elem) return;
    var elm = jQuery(elem);
    if(elm.length!=1) return;
    var elmClassName = elm.attr("class");
    var parent = elm.parent();

    var onchangecallback = onchange;

    var elmWithNames = parent.children("."+elmClassName+'_name'); 
    var WPWOOFnames     = htmlDecode(elmWithNames.val()).split(" > ");
    elmWithNames.val("");

    var changeTaxonomy = function (selector){
        var level = jQuery(selector).attr('data-level');

        parent.children("select.wpwoofeed_g_category").each(function ( ) {
            if (jQuery(this).data("level") > level) {
                if (jQuery(this).next().is( "p" ) && jQuery(this).next().children().length==0) { //remove "<p></p>"
                    jQuery(this).next().remove();
                }
                jQuery(this).remove();
            }
        });

        WPWOOFnames = elmWithNames.val().split(" > ").slice(0, level);


        if(jQuery(selector).val()!="") {
            WPWOOFnames = jQuery(selector).find("option:selected").val().split(" > ");
        }
        parseMyInputs();
        if(jQuery(selector).val()!="") {    loadTaxonomy(level);   }
    }
    function parseMyInputs(){
        elmWithNames.val(WPWOOFnames.join(' > '));
        if(onchangecallback) onchangecallback();
    }
    function loadTaxonomy(i) {
        i = parseInt(i);
        var elmspinner = "<img class='wpwoofeed_g_spinner' src='/wp-includes/images/wpspin.gif' />";
        elm.before(elmspinner);
        let taxonomy = WPWOOFnames.length?WPWOOFnames.join(" > "):"";
        if (typeof(wpwoof_taxonomyPreLoad[taxonomy===''?'root':taxonomy]) !== "undefined") {
            processAnsw( wpwoof_taxonomyPreLoad[taxonomy===''?'root':taxonomy],i);
//            console.log('preload');
        } else {
            jQuery.post(ajaxurl, {
                'action': 'wpwoofgtaxonmy',
                'id': i,
                'taxonomy': taxonomy,
            }, function (answ) {
                wpwoof_taxonomyPreLoad[taxonomy] = answ;
                processAnsw(answ, i);
            }, "JSON");
        }
    }
    
    function processAnsw(answ, i) {
        parent.children("img.wpwoofeed_g_spinner").remove();
            var max = i===-1?WPWOOFnames.length:i+1;
            var start = i===-1?0:i+1;
        if (answ) {
            for (var ilvl = start; ilvl <= max; ilvl++) {
                if (typeof(answ[ilvl]) == "undefined" || Object.keys(answ[ilvl]).length === 0) {
                    break;
                }
                var selval = WPWOOFnames[ilvl] ? WPWOOFnames[ilvl] : ""; 
                let fullValue = WPWOOFnames.slice(0, ilvl).join(" > ");
                var DropDownElement = "<select class='wpwoofeed_g_category " + elmClassName + "_" + ilvl + " selTaxonomy short' data-level='" + ilvl + "'  >"; //onchange='oTaxonony.change("+k+",this);'
                DropDownElement += "<option value='' " + (selval == "" ? "selected='selected'" : "") + ">select</option>";
                for (var idx in answ[ilvl]) {
                    let tmpFV = ilvl?fullValue + " > " + answ[ilvl][idx]:answ[ilvl][idx];
                    DropDownElement += "<option value='" + tmpFV + "' " + (selval == answ[ilvl][idx] ? "selected='selected'" : "") + ">" + answ[ilvl][idx] + "</option>";
                }
                DropDownElement += "</select><p></p>";
                var ddDrop = jQuery(DropDownElement);
                ddDrop.change(function () {
                    changeTaxonomy(this);
                });
                elm.before(ddDrop);
                parseMyInputs();
            }
        }
    }
    
    function htmlDecode(value) {
        return jQuery('<div/>').html(value).text();
    }

    loadTaxonomy(-1);

    return {
        change : changeTaxonomy
    };
}

function copyWoofLink( buffer ){
    const el = document.createElement('textarea');
    el.value = buffer ;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return false;
}

wpwoof_taxonomyPreLoad = {};
