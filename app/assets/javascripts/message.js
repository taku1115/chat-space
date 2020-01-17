$(function(){
  var reloadMessages = function() {
    last_message_id = $('.chat-main__message:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i,message) {
          insertHTML += buildHTML(message)
        });
        $('.chat-main__message-list').append(insertHTML);
        $('.chat-main__message-list').animate({ scrollTop: $('.chat-main__message-list')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert("自動更新に失敗しました");
    });
   };

    function buildHTML(message) {
        if ( message.image && message.content ) {
          var html =
            `<div class="chat-main__message" data-message-id=${message.id}>
               <div class="message-top">
                <div class="message-top__name">
                  ${message.user_name}
                </div>
                <div class="message-top__date">
                  ${message.created_at}
                </div>
              </div>
              <div class="message-text">
                <p class="message-text__content">
                  ${message.content}
                </p>
              </div>
              <img src=${message.image} >
            </div>`
        } else if (message.content) {
          var html =
            `<div class="chat-main__message" data-message-id=${message.id}>
              <div class="message-top">
                <div class="message-top__name">
                  ${message.user_name}
                </div>
                <div class="message-top__date">
                  ${message.created_at}
                </div>
              </div>
              <div class="message-text">
                <p class="message-text__content">
                  ${message.content}
                </p>
              </div>
            </div>`
        } else if (message.image) {
          var html =
            `<div class="chat-main__message" data-message-id=${message.id}>
               <div class="message-top">
                <div class="message-top__name">
                  ${message.user_name}
                </div>
                <div class="message-top__date">
                  ${message.created_at}
                </div>
              </div>
              <div class="message-text">
                <img src=${message.image} >
              </div>
            </div>
          </div>`
        };
        return html;
      }; 
$('#new_message').on('submit', function(e) {
  e.preventDefault();
  var formData = new FormData(this);
  var url = $(this).attr('action');
  $.ajax({
    url: url,
    type: "POST",
    data: formData,
    dataType: 'json',
    processData: false,
    contentType: false
  })
   .done(function(data){
     var html = buildHTML(data);
     $('.chat-main__message-list').append(html);
     $('.chat-main__message-list').animate({scrollTop: $('.chat-main__message-list')[0].scrollHeight});
     $('form')[0].reset();
     $('.send-btn').attr('disabled', false);
   })
   .fail(function() {
     alert("メッセージの送信に失敗しました");
     $('.send-btn').attr('disabled', false);
   });
})

 
 if (document.location.href.match(/\/groups\/\d+\/messages/)) {
  setInterval(reloadMessages, 3000);
  }
});