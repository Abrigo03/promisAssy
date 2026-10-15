$(document).on("click", "#folID", function () {

    var DataId = $(this).attr("data-machine-id");

    $('#myModal').modal({
        backdrop: 'static',
        keyboard: false,
        show: true
    })
    showData(DataId);
});

$(document).on("click", "#eolID", function () {
    
    var DataId = $(this).attr("data-machine-id");

    $('#myModal').modal({
        backdrop: 'static',
        keyboard: false,
        show: true
    })
    showData(DataId);
});

function showData(DataId) {
    
    $.post( //on ready
            base_url + "promis/show_data",
            {
                "id": DataId
            },
            function (data) {
                var StatusOwner = ''; //status owner
                $("#date").val(data.File_DateTime);
                $("#machinePlatform").val(data.TesterPF);
                $("#machineID").val(data.Tester_ID);
                StatusOwner += "<option class= 'stat_Owner' value='" + data.Status_Owner + "'>" + data.Status_Owner + "</option>";

                $.post( 
                    base_url + "promis/get_status_owner",
                    function (stsO) {
                        
                        $.each(stsO, function (i, StsOwner) {
                            if (StsOwner.owner == data.Status_Owner)//if the array data found a match it will only leave a black
                            {
                            }
                            else
                            {
                                //StatusOwner += "<option class= 'stat_Owner' value='" + StsOwner.owner + "'>" + StsOwner.owner + "</option>";
                                StatusOwner += "<option class= 'stat_Owner' value='" + StsOwner.OWNER + "'>" + StsOwner.OWNER + "</option>";
                            }

                    });
                    $("#stsOwner").append(StatusOwner);
                    }
                );

                var stat = ''; //status
                //stat += "<option class='status' value='" + data.Status_Desc + "'>" + data.Status_Desc + "</option>";
                stat += "<option class='status' value='" + data.Status_Desc + "'>" + data.Status_Desc + "</option>";

                var stsOwner = data.Status_Owner;
                
                $.post( 
                    base_url + "promis/get_status",
                    {
                        "stsOwner": stsOwner
                    },
                    function (stsOwner) {
                        $.each(stsOwner, function (i, desc) {

                            //if (desc.description == data.Status_Desc)
                            if (desc.DESCRIPTION == data.Status_Desc)
                            {
                            }
                            else {
                                //stat += "<option class='status' value='" + desc.description + "'>" + desc.description + "</option>";
                                stat += "<option class='status' value='" + desc.DESCRIPTION + "'>" + desc.DESCRIPTION + "</option>";
                            }

                        });

                        $("#stsDes").append(stat);

                    }

                );

                var show_device = ''; //family
                show_device += "<option class='fam' value='" + data.Device + "'>" + data.Device + "</option>";

                $.post(
                    base_url + "promis/get_device",

                    function (device) {
                        $.each(device, function (i, family) {

                            if (family.New_Family == data.Device)
                            {
                                var family_name = data.Device;
                                var machineID = $("#machineID").val();
                                var machinePlatform = $('#machinePlatform').val();
                               
                                $.post( //uph
                                    base_url + "promis/get_uph_check",
                                    {
                                        "family": family_name,
                                        "machineID": machineID,

                                    },
                                    function (uph_byID) {
                                        
                                        if (uph_byID.uph == null)
                                        {
                                            
                                            $.post( 
                                                base_url + "promis/get_uph",
                                                {
                                                    "id": family_name,
                                                    "machinePlatform": machinePlatform,

                                                },
                                                function (uph) {
                                                    var show_uph = "";
                                                    if (uph.uph != null) {
                                                        show_uph = "<option class='uph_select' value='" + uph.uph + "'>" + uph.uph + "</option>";
                                                    }
                                                    else {
                                                        show_uph = "<option class='uph_select' value=''></option>";
                                                    }
                                                    $("#uph_select").append(show_uph);

                                                }
                                            );
                                        }
                                        else {
                                            var show_uph = "";
                                            show_uph = "<option class='uph_select' value='" + uph_byID.uph + "'>" + uph_byID.uph + "</option>";
                                            $("#uph_select").append(show_uph);
                                        }
                                    }
                                 );
                            }
                            else {
                                show_device += "<option class='fam' value='" + family.New_Family + "'>" + family.New_Family + "</option>";
                            }
                        });

                        $("#prodName").append(show_device);
                    }
                );


                //if (data.Lot_Name == "N/A" || data.Lot_Name == "") //For Track In
                //{
                //    $("#track_out").prop("disabled", true);
                //    $("#track_in").prop("disabled", false);
                //}

                //else if (data.Lot_Name != "N/A" || data.Lot_Name != "")
                //{
                //    $("#track_in").prop("disabled", true);
                //    $("#track_out").prop("disabled", false);
                //    $("#lotNo").prop("disabled", true);
                //}
                
                //
                $("#lotNo").val(data.Lot_Name); // lot no
                $(".process").val(data.process);
                //$(".track").val(data.track);
             
                var pkg_type = '' // pkg type

                pkg_type = "<option class='pkgType' value='" + data.pkg_type + "'>" + data.pkg_type + "</option>"
                $("#pkgType").append(pkg_type);
                console.log(data.Who_id);
                if (data.Who_id != "")
                {
                    //alert(data.Who_id);
                    $.post(
                       base_url + "promis/get_user",
                       function (usr) {
                           var users = '';
                           users += "<option class='user' data-user-id='" + data.Who_id + "' value='" + data.Who + "'>" + data.Who + "</option>";
                           $.each(usr, function (i, username) {
                               users += "<option class='user' data-user-id='" + username.id + "' value='" + username.email_address + "'>" + username.email_address + "</option>";
                           });

                           //$("#users_promis").append(users);
                           $("#user").append(users);

                       }
                   );
                }
                else
                {
                    //alert('false');
                    $.post(
                       base_url + "promis/get_user",
                       function (usr) {
                           var users = '';
                           //users += "<option class='user' data-user-id='" + data.Who_id + "' value='" + data.Who + "'>" + data.Who + "</option>";
                           $.each(usr, function (i, username) {
                               users += "<option class='user' data-user-id='" + username.id + "' value='" + username.email_address + "'>" + username.email_address + "</option>";
                           });

                           //$("#users_promis").append(users);
                           $("#user").append(users);

                       }
                   );
                   
                }
                

            }
        );

};


$(document).on("change", "#stsOwner", function() {
    var stsOwner = $("#stsOwner").val();
    $('option').remove('.status');

    $.post(
        base_url + "promis/get_status",
        {
            "stsOwner": stsOwner
        },
        function (data)
        {

            var StatusDesc = '';
            //stsDes
            StatusDesc += "<option class='status' value=''></option>";
            $.each(data, function (i, status) {
                //StatusDesc += "<option class='status' value='" + status.description + "'>" + status.description + "</option>";
                StatusDesc += "<option class='status' value='" + status.DESCRIPTION + "'>" + status.DESCRIPTION + "</option>";
            });
            
            $("#stsDes").append(StatusDesc);

        }

    );
});

$(document).on("change", "#prodName", function () {
    $('option').remove('.pkgType');
    $('option').remove('.uph_select');
    var id = $(this).val();
    var machineID = $("#machineID").val();
    var machinePlatform = $('#machinePlatform').val();
    $('option').remove('.stat');
   
       $.post(
        base_url + "promis/get_package_data",
        {
            "id": id
        },
        function (data) {
            display = "<option class='pkgType' value='" + data.New_Package + "'>" + data.New_Package + "</option>"
            $("#pkgType").append(display);
            //stsDes
        }
    );

    //$.post( // show option 1 uph // for future modification
    //    base_url + "promis/get_uph",
    //    {
    //        "id": id,
    //        "machinePlatform": machinePlatform,
            
    //    },
    //    function (uph) {
    //        var show_uph = "";
    //        show_uph = "<option class='uph_select' value='" + uph.uph + "'>" + uph.uph + "</option>";
    //        $("#uph_select").append(show_uph);

    //    }
    // );

       $.post( // show option 1 uph // for future modification
            base_url + "promis/get_uph_check",
            {
                "family": id,
                "machineID": machineID,

            },
            function (uph_byID) {

                if (uph_byID.uph == null) {

                    $.post( // show option 1 uph // for future modification
                        base_url + "promis/get_uph",
                        {
                            "id": id,
                            "machinePlatform": machinePlatform,

                        },
                        function (uph) {
                            var show_uph = "";
                            if (uph.uph != null)
                            {
                                show_uph = "<option class='uph_select' value='" + uph.uph + "'>" + uph.uph + "</option>";
                            }
                            else
                            {
                                show_uph = "<option class='uph_select' value=''></option>";
                            }
                            $("#uph_select").append(show_uph);

                        }
                    );
                }
                else {
                    var show_uph = "";
                    show_uph = "<option class='uph_select' value='" + uph_byID.uph + "'>" + uph_byID.uph + "</option>";
                    $("#uph_select").append(show_uph);
                }
            }
        );


});

$(document).on("click", "button.close", function () {

    $('option').remove('.fam');
    $('option').remove('.stat_Owner');
    $('option').remove('.status');
    $('option').remove('.pkgType');
    $('option').remove('.uph_select');
    $('option').remove('#user');
    $('#track_in').prop('disabled', false);
    $('#track_out').prop('disabled', false);
    $('#lotNo').prop('disabled', false);
    $('.track').attr('value', '');

});

$(document).on("click", "#save", function (e) {
    e.preventDefault();
    Update_Machine();
});

//$(document).on("change", "#lotNo", function ()
//{
//    if ($("#lotNo").val() == "" || $("#lotNo").val() == "N/A") {
//        $('#track_in').prop('disabled', true);
//    }

//});

//$(document).on("click", "#track_in", function ()
//{
    
//    if ($("#lotNo").val() == "" || $("#lotNo").val() == "N/A") {
//        alert('Please Input LOT NO.');
//    }
//    else
//    {
//        $('.track').val('TRACK IN');
//        $('#track_in').attr('disabled', true);
//    }
//});

//$(document).on("click", "#track_out", function () {
    
//    $('.track').val('TRACK OUT');
//    $('#track_out').attr('disabled', true);
//});


function Update_Machine() {
    var dateTime = new Date($.now());
    var date = Date.parse(dateTime);
    var date1 = date.toString('yyyy-MM-dd HH:mm');
    var date2 = date.toString('yyyyMMddHHmmss');
    var date3 = date.toString('M/d/yyyy HH:mm');
    var itvdate = date.toString('yyyy/MM/dd HH:mm:ss');
    //var itvdate = date.toString('M/d/yyyy HH:mm:ss');
    var machineID = $("#machineID").val();
    var machinePF = $("#machinePlatform").val();
    var stsOwner = $("option:selected", "#stsOwner").text(); //$(this).attr("value#stsOwner");
    var stsDes = $("option:selected", "#stsDes").text();
    if (stsDes == "LSG REPAIR" || stsDes == "LSG WAIT" || stsDes == "LSG ISOLATION" || stsDes == "TESTER REPAIR" || stsDes == "TESTER WAIT" || stsDes == "TESTER MAJOR BREAKDOWN"
    || stsDes == "HANDLER MAJOR BREAKDOWN" || stsDes == "HANDLER REPAIR" || stsDes == "TESTER MAJOR BREAKDOWN" || stsDes == "PROCESS ENGG WAIT" || stsDes == "SETUP WAIT"
    || stsDes == "HARDWARE REPAIR/HW BREAKDOWN" || stsDes == "HARDWARE REPAIR/HW BREAKDOWN" || stsDes == "HARDWARE WAIT" || stsDes == "WAITING YIELD VERIFICATION (YIG)"
    || stsDes == "FOI" || stsDes == "QUANTIFICATION") { //Red - UNSCHEDULED
        var stsDwn = 0;
    }
    else if (stsDes == "HANDLER PM" || stsDes == "TESTER PM/CAL" || stsDes == "PRODUCT ENGG SCHED" || stsDes == "SETUP CONVERSION" || stsDes == "EBR DEVICE QUAL"
    || stsDes == "HANDLER IMPROVEMENT PROJECTS" || stsDes == "LRT SCHEDULED" || stsDes == "WEEKLY TEMP CHECK" || stsDes == "PM BURN IN_LRT")
    {
        stsDwn = 1;
    }
    else if (stsDes == "NEW SETUP")
    {
        stsDwn = 2;
    }
    else if (stsDes == "MATDOWN")
    {
        stsDwn = 4;
    }
    else if (stsDes == "RUNNING PRODUCTION" || stsDes == "SPEEDLOSS DUE TO HANDLER" || stsDes == "SPEEDLOSS DUE TO TESTER" || stsDes == "SPEEDLOSS DUE TO HARDWARE" || stsDes == "100% RETEST" || stsDes == "RESCREEN")
    {
        stsDwn = 5;
    }
    else
    {
        stsDwn = 3;
    }
    var prodName = $("option:selected", "#prodName").text();
    var lotNo = $("#lotNo").val();
    var uph = $("option:selected", "#uph_select").text();
    if (uph == "") {
        uph = 0.0;
    }
    var pkgType = $("option:selected", "#pkgType").text();
    var temp_remarks = $("#remarks").val();
    //var remarks = temp_remarks.trim();
    var remarks = temp_remarks.replace(/(\r\n|\n|\r)/gm, " ");
    var group = $("option:selected", "#group").text();
    var user = $("#user").val();
    var pass = $("#pass").val();
    var material_id = $(".inputTxt").val();
    var track = $(".track").val();
    var userID = $("option:selected", "#user").data("user-id");
    //alert($('option.user [value="' + user + '"]').data('user-id'));
    //alert(user);

    //var userID = $('#users_promis [value="' + user + '"]').data('user-id');
    if (track == "TRACK IN")
    {
        var track_in = 1;
        var track_out = 0;
    }
    else if (track == "TRACK OUT")
    {
        var track_in = 0;
        var track_out = 1;
    }
    var process = $(".process").val();
  
    //var formData = new FormData();
    
    var FOL_DATA_UPDATE = {
        "machineID": machineID,
        "machinePF": machinePF,
        "stsOwner": stsOwner,
        "stsDes": stsDes,
        "prodName": prodName,
        "lotNo": lotNo,
        "uph": uph,
        "pkgType": pkgType,
        "remarks": remarks,
        "group": group,
        "user": user,
        "userID":userID,
        "material_id": material_id,
        "date1": date1,
        "date2": date2,
        "date3": date3,
        "itvdate":itvdate,
        "process": process,
        "track_in": track_in,
        "track_out": track_out,
        "stsDwn": stsDwn
    }

    if ($("#lotNo").val() == "N/A" || $("#lotNo").val() == "" || $("#prodName").val() == "N/A" || $("#prodName").val() == "" || $("#remarks").val() == "" || $("#stsDes").val() == "")
    {
        alert('PLEASE INPUT LOT ID / FAMILY NAME / REMARKS / STATUS');
    }
    else
    {
    //Update Machine
    $.post(

            base_url + "promis/hash_test",
            {
                "pass": pass
            },
            function (password) {

                $.post(
                    base_url + "promis/check_user",
                    {
                        "user": user,
                        "pass": password
                    },
                    function (access) {

                        if (access.email_address != null) {

                            ////if (track == "" || track == "N/A") {
                            ////    alert('no track input');
                            ////}
                            ////else {
                            ////    alert('track capable');
                            ////    $.post(
                            ////        base_url + "promis/track_lot",
                            ////        FOL_DATA_UPDATE,
                            ////        function (track) {
                            ////            console.log(track);
                            ////        }
                            ////    );
                            ////}

                            $.post(
                                base_url + "promis/update_machine",
                                FOL_DATA_UPDATE,
                                function (data) {
                                    $.post(
                                        base_url + "promis/update_machine_history",
                                        FOL_DATA_UPDATE,
                                        function (history) {
                                            //itv
                                            $.post(
                                                base_url + "promis/check_existing_equiphistory",
                                                FOL_DATA_UPDATE,
                                                function (check_equiphistory) {

                                                    if (check_equiphistory.done == "NO MACHINE") {
                                                        alert("MISSING MACHINE, PLEASE CONTACT APPS TEAM");
                                                    }
                                                    else if (check_equiphistory.done == "NO DTCODE") {
                                                        alert("NO STATUS HAS BEEN INPUTTED, PLEASE INPUT STATUS");
                                                    }
                                                    else {

                                                        if (check_equiphistory.ID != null) {
                                                            //alert('Existing in iTV, Updating Old file');
                                                            $.post(
                                                                base_url + "promis/update_existing_equiphistory",
                                                                {
                                                                    "id": check_equiphistory.EQUIPLISTID
                                                                },
                                                                function (insert_equiphistory) {
                                                                    $.post(
                                                                        base_url + "promis/insert_equiphistory",
                                                                        FOL_DATA_UPDATE,
                                                                        function (insert_equiphistory) {
                                                                            if (base_url + "promis/eolStatus" == window.location.href) {
                                                                                window.location.href = base_url + "promis/eolStatus";
                                                                            }
                                                                            else if (base_url + "promis/folStatus" == window.location.href) {
                                                                                window.location.href = base_url + "promis/folStatus";
                                                                            }
                                                                        }
                                                                    );
                                                                }
                                                            );
                                                        }
                                                        else {
                                                            //alert('Not Existing in ITV Creating new File');
                                                            $.post(
                                                                base_url + "promis/insert_equiphistory",
                                                                FOL_DATA_UPDATE,
                                                                function (insert_equiphistory) {
                                                                    if (base_url + "promis/eolStatus" == window.location.href) {
                                                                        window.location.href = base_url + "promis/eolStatus";
                                                                    }
                                                                    else if (base_url + "promis/folStatus" == window.location.href) {
                                                                        window.location.href = base_url + "promis/folStatus";
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    }
                                                }
                                            );
                                        }
                                    )
                                }
                            );
                        }
                        else {
                            alert('Invalid Credentials, Please Try Again');
                        }
                    }
                )

            }
    )

    }
}