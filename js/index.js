var vmIndex;
window.onload = function() {
    mongo_load("jobs", "0");


    //點擊視窗外關閉小視窗
    $(document).click(function(event) {
        //關閉loging視窗
        $('.login_page').css({
            top: '0px',
            visibility: 'hidden',
            opacity: '0'
        });
        $('.blur').css("filter", "blur(0px)");
        //關閉詳細資訊        
        $('.detail_form').css("display", "none");
        $('.blur').css("filter", "blur(0px)");

    });


    //讀取工作資訊後，標記已收藏的工作
    setTimeout(update_bookmark, 500);

    vmIndex = new Vue({
        el: "#index",
        data: {
            //info buffer
            jobs: [],
            folder: [],

            //login data
            account: '',
            password: '',
            errMsg: '',
            user: '登入',

            //register data
            account_r: '',
            psd_r: '',
            cpsd: '',
            errMsg_r: ''

        },
        methods: {
            login: function() {
                var check = 1;

                if (check) {
                    $.ajax({
                        url: './php/login.php',
                        type: 'POST',
                        data: {
                            account: vmIndex.account,
                            psd: vmIndex.password
                        },
                        success: function(res) {
                            //獲取使用者資訊方塊
                            folder_list = JSON.parse(res);
                            //登入成功
                            try {
                                console.log(folder_list[0].save);
                                vmIndex.folder = folder_list[0].save; //login
                                update_bookmark();
                                vmIndex.user = vmIndex.account;
                                //顯示收藏夾
                                $('.folder').css("display", "inline-block")

                                //關閉loging視窗
                                $('.login_page').css({
                                    top: '0px',
                                    visibility: 'hidden',
                                    opacity: '0'
                                });
                                $('.blur').css("filter", "blur(0px)");
                                //登入失敗
                            } catch (err) {
                                vmIndex.errMsg = "帳號密碼錯誤";
                                $('#error').css('color', '#ffb336');
                                setTimeout(function() {
                                    $('#error').css('color', 'white');
                                }, 300)
                            }


                        },
                        error: function(m) {
                            alert('Login error' + m.status);
                        }
                    });
                }
            },
            register: function() {
                //確認密碼相同
                var check_psd = false;
                var patten = new RegExp("[0-9a-z]{4,}");

                if ((vmIndex.psd_r == vmIndex.cpsd) && (vmIndex.account_r != vmIndex.cpsd) && patten.test(vmIndex.account_r) && patten.test(vmIndex.cpsd)) {
                    check_psd = true;
                } else {
                    vmIndex.errMsg_r = "密碼不符";
                }
                if (check_psd) {
                    $.ajax({
                        url: './php/register.php',
                        type: 'POST',
                        data: {
                            account: vmIndex.account_r,
                            password: vmIndex.psd_r
                        },
                        success: function(res) {
                            var status = JSON.parse(res).finish
                            if (status == '1') {
                                vmIndex.errMsg_r = "創建成功請重新登入";
                                vmIndex.account_r = '';
                                vmIndex.psd_r = '';
                                vmIndex.cpsd = '';

                            } else if (status == 'account') {
                                vmIndex.errMsg_r = "此帳號已有人使用";
                            } else if (status == 'psd') {
                                vmIndex.errMsg_r = "此密碼已有人使用";
                            }
                        },
                        error: function(m) {
                            alert(m.status + ' register');
                        }
                    })

                }

            },
            logout: function() {
                vmIndex.user = '登入';
                vmIndex.account = '';
                vmIndex.password = '';
                vmIndex.folder = [];
                vmIndex.errMsg = '';
                $('.folder').css('display', 'none');
                bookmark_initial();
            },
            toManager: function(){
                window.location.href='http://localhost/manager/manager/latest/login.php'
            },
            stop: function(e) {
                e.stopPropagation()

            },
            show_login: function(e) {
                if (vmIndex.user == '登入') {
                    e.preventDefault();
                    e.stopPropagation();
                    $('.login_page').css({
                        top: '150px',
                        visibility: 'initial',
                        opacity: '1'
                    });
                    $('.blur').css("filter", "blur(2px)");

                    vmIndex.account = '';
                    vmIndex.password = '';
                    vmIndex.errMsg = '';
                    vmIndex.errMsg_r = '';

                }


            },
            load_work: function(info_type) {
                mongo_load(info_type, "0");


                //讀取工作資訊後，標記已收藏的工作
                setTimeout(bookmark_initial, 300);
                setTimeout(update_bookmark, 500);
                load_animation();

                //slide to info
                $('html,body').animate({
                        scrollTop: $(".filterbar").offset().top
                    },
                    'slow');

            },
            filter: function(job_type) {
                mongo_load("jobs", job_type);
                load_animation()
                setTimeout(bookmark_initial, 300)
                setTimeout(update_bookmark, 500)

                console.log(job_type);
            },
            //關閉資訊
            cancel_detail: function() {
                $('.detail_form').css("display", "none");
                $('.blur').css("filter", "blur(0px)");
            },
            //展開詳細資訊
            display_detail: function(index) {
                event.preventDefault();
                event.stopPropagation();
                $('#' + 'detail' + index).css("display", "block");
                $('.blur').css("filter", "blur(2px)");

            },
            //點擊收藏夾
            click_folder: function() {
                var folder_status = $('.fa-folder-o').attr('open_status');
                if (folder_status == 'false') {

                    folder_load();

                    $('.folder_detail').css('visibility', 'initial')
                    $('.bottom_flag').css('visibility', 'initial');
                    $('.folder_detail, .bottom_flag').css('opacity', '1');
                    $('.fa-folder-o').attr('open_status', 'true');
                } else if (folder_status == 'true') {
                    $('.folder_detail').css('visibility', 'hidden')
                    $('.bottom_flag').css('display', 'none');
                    $('.folder_detail, .bottom_flag').css('opacity', '0');
                    $('.fa-folder-o').attr('open_status', 'false');
                }


            },
            clear_folder: function() {
                $.ajax({
                    url: "./php/bookmark.php",
                    type: "POST",
                    // dataType: "json",
                    data: {
                        status: 'clear',
                        account: vmIndex.account
                    },
                    //data為成功request後php傳回的資料
                    success: function(data) {
                        vmIndex.folder = [];
                    },
                    error: function(jqXHR) {
                        alert("發生錯誤: " + jqXHR.status);
                        console.log(vmIndex.account);
                    }
                });

                setTimeout(bookmark_initial, 300);
            },
            //點及已收藏的工作
            display_detail_from_folder: function(post_id) {
                event.preventDefault();
                event.stopPropagation();
                $('.detail_form').css('display', 'none');
                $("[post_id='" + post_id + "']").css("display", "block");
                $('.blur').css("filter", "blur(2px)");
            },
            bookmark: function(index, id) {
                //確認登入才開放使用收藏功能
                if (vmIndex.user != '登入') {
                    //點擊書籤動畫
                    var save_status = $('#' + 'bookmark' + index).attr('status');
                    if (save_status == 'false') {
                        $('#' + 'bookmark' + index).attr('status', 'true');
                        $('#' + 'bookmark' + index).css({
                            "background-color": "#ffb336",
                            "color": "#f3f7f7"
                        });

                        console.log('save');

                    } else if (save_status == 'true') {
                        $('#' + 'bookmark' + index).attr('status', 'false');
                        $('#' + 'bookmark' + index).css({
                            "background-color": "#27232F",
                            "color": "#f3f7f7"
                        });


                        console.log('unsave');
                    }
                    //儲存書籤或移除書籤
                    $.ajax({
                        url: "./php/bookmark.php",
                        type: "POST",
                        // dataType: "json",
                        data: {
                            info: JSON.stringify(vmIndex.jobs[id]), // 工作資訊塊
                            status: save_status,
                            current_info_id: index,
                            account: vmIndex.account
                        },
                        //data為成功request後php傳回的資料
                        success: function(data) {
                            if (data.status) {
                                // alert(index + " save Complete !");
                            } else {
                                // alert(index + " has been deleted!");
                            }

                        },
                        error: function(jqXHR) {
                            alert("發生錯誤: " + jqXHR.status);
                            console.log(vmIndex.account);
                            console.log(JSON.stringify(vmIndex.jobs[id]));
                        }
                    });
                } else { //尚未登入點擊收藏提醒動畫
                    event.stopPropagation();
                    $('.login_message').css({
                        top: '50%',
                        opacity: '1'
                    });
                    $('.blur').css("filter", "blur(2px)");
                    setTimeout(function() {
                        $('.login_message').css({
                            top: '80%',
                            opacity: '0'
                        });
                        $('.blur').css("filter", "blur(0px)");
                    }, 1500);
                }

            },
        }
    });
    //讀取mongoDB
    function mongo_load(get, filter_type) {
        $.ajax({
            url: "./php/load.php",
            type: "GET",
            data: {
                get_info: get,
                filter: filter_type
            },
            success: function(res) {
                if (get == "jobs") {
                    vmIndex.jobs = JSON.parse(res);
                    console.log(vmIndex.jobs);
                } else if (get == "intern") {
                    vmIndex.jobs = JSON.parse(res);
                    console.log(vmIndex.jobs);
                }
            }
        });
    }
    //讀取account folder
    function folder_load(clear) {
        $.ajax({
            url: "./php/folder.php",
            type: "POST",
            data: {
                account: vmIndex.account,
                clear: clear
            },
            success: function(res) {
                vmIndex.folder = JSON.parse(res)[0].save;
                console.log(JSON.parse(res)[0].save);
            },
            error: function(m) {
                console.log(m.status);
            }
        })
    }
    // 標上已存的工作
    function update_bookmark() {
        var save_list = [];

        for (var i = 0; i < vmIndex.folder.length; i++) {

            save_list.push(vmIndex.folder[i].post_id);
        }
        console.log(save_list);
        for (var j = 0; j < save_list.length; j++) {
            console.log("[bookmark_post_id = '" + save_list[j] + "']");
            $("[bookmark_post_id = '" + save_list[j] + "']").attr('status', 'true');
            $("[bookmark_post_id = '" + save_list[j] + "']").css({
                "background-color": "#ffb336",
                "color": "#f3f7f7"
            });
            console.log('end');
        }
    }

    function bookmark_initial() {
        $('.fa-bookmark-o').css({
            color: '#f3f7f7',
            backgroundColor: '#27232F'
        });
        $("[status='true']").attr("status", "false");
    }

    function load_animation() {
        $('.info_page').css({
            opacity: '0.3'
        });
        setTimeout(function() {
            $('.info_page').css({
                opacity: '1'
            });
        }, 200);
    }
};
