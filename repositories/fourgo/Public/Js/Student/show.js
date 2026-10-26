$(document).ready(function(e){
    $('.cntl').cntl({
        revealbefore: 300,
        anim_class: 'cntl-animate',
        onreveal: function(e){
            console.log(e);
        }
    });
});
$(window).load(function(){
  changeActive("#header5");
});
