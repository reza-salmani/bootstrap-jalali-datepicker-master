# Bootstrap Datepicker Persian Leap Year v1.1 #

A jQuery UI Datepicker widget with Twitter Bootstrap theme.  It's based on jQuery UI +1.9.1 and Twitter Bootstrap 2.1.1.

This is an Update for Rahman Mousavian's bootstrap-jalali-datepicker for fixing persian leap-year like 1403 & 1408. use this with confidence 😉

## Usage ##

    <input type="text" name="date" class="datepicker" />

    <script>
        $(document).ready(function() {
            $(".datepicker").datepicker();
        });
    </script>

Using fancy bootstrap input/button combo:

    <div class="control-group">
        <label class="control-label" for="datepicker">Date</label>
        <div class="controls">
            <div class="input-append">
                <input id="datepicker" class="input-small" type="text">
                <button id="datepickerbtn" class="btn" type="button"><i class="icon-calendar"></i></button>
            </div>
        </div>
    </div>

    <script>
        $(document).ready(function() {
            $("#datepicker").datepicker();
            $("#datepickerbtn").click(function(event) {
                event.preventDefault();
                $("#datepicker").focus();
            })
        });
    </script>
