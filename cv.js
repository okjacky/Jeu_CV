$(function(){
    cvs.addEventListener('click', function(){
   
        if(score.value > 0){
            console.log('display !!')
            $('#intro').fadeOut(500);
            $('#competence').fadeIn(2000);
            $('#js').fadeIn(3500);
        }
        if(score.value > 2){
            $('#cciale').fadeIn(2000);
        }
        if(score.value > 4){
            $('#exp').fadeIn(1500);
        }
    });

    $(window).scroll(function(){
        // console.log('scroll: '+ $(document).scrollTop())
        // console.log('offset : '+ ($('header').offset().top));
        
        if($('header').offset().top > 1){
           $('header').css('height', 50 +'px');
           
        }else{$('header').css('height', 80 +'px'); }
        
    })

    var move = 0;
    $("#button3").click(function(){
        
        if(move === 0){
           
            console.log('coucouc')
            $('#box3 img').animate(
                { deg: 720},
                {duration: 1200,
                    step: function(now) {
                    console.log('rotate')
                    $(this).css({ transform: 'rotate(' + now + 'deg)' });
                    },
                    done : function(){
                        var now = 0;
                        $(this).css({ transform: 'rotate(' + now + 'deg)' });
                    }
                }
            );
            move = 1;
           
        }else{ 
            
            $('#box3 img').animate(
            { deg: -720},
            {duration: 1200,
                step: function(now) {
            
                $(this).css({ transform: 'rotate(' + now + 'deg)' });
                }
            }
           
            );
            move = 0;
        }
    });
  
    $( "#button1" ).click(function() {
       
        $( "#box1" ).animate({
          width: "20%",
          opacity: 0,
        
          marginLeft: "0.2in",
          fontSize: "3em",
          borderWidth: "10px"
        }, 1500 );
      });

    //  ----------------- Partie Sortable-----------------
      $( "ul.droptrue" ).sortable({
        connectWith: "ul"
      });
   
      $( "ul.dropfalse" ).sortable({
        connectWith: "ul",
        dropOnEmpty: false
      });
   
      $( "#sortList1, #sortList2, #sortList3" ).disableSelection();

    //  -------------------Partie toDoList-------------------
    $( ".column" ).sortable({
        connectWith: ".column",
        handle: ".portlet-header",
        cancel: ".portlet-toggle",
        placeholder: "portlet-placeholder ui-corner-all"
    });
   
    $( ".portlet" )
    .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
    .find( ".portlet-header" )
        .addClass( "ui-widget-header ui-corner-all" )
        .prepend( "<span class='ui-icon fi-fullscreen-exit portlet-toggle'></span>");

    $( ".portlet-toggle" ).on( "click", function() {
    var icon = $( this );
    icon.toggleClass( "fi-fullscreen-exit fi-sort-ascending" );
    icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
    });
     
  
});

