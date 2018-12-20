describe('Home', function () {
    beforeEach(function () {
        //use web context as default
        browser.context(browser.contexts().value[1]);
        // Wait up to 5 seconds for commands to work
        browser.timeouts('implicit', 5000);
    });
    afterEach(function () {
        //default orientation is portrait
        browser.orientation('portrait');
        //call reload(), if you wan't to run each test isolated from the others
        //browser.reload();
    });
    beforeAll(function () {
        console.log('capabilities: ' + JSON.stringify(browser.desiredCapabilities));
    });
    it('should display message', function () {
        browser.click('#myButton');
        var message = browser.getText('#message');
        expect(message).toBe('Button clicked, success!');
    });
    it('should print input', function () {
        var inputField = $('#myInputField input');
        inputField.click();
        browser.pause(1000);
        inputField.setValue('This is my value');
        var message = browser.getText('#input');
        expect(message).toBe('This is my value');
    });
    it('should turn to landscape', function () {
        expect(browser.orientation()['value']).toBe('PORTRAIT');
        browser.orientation('landscape');
        browser.pause(1000);
        expect(browser.orientation()['value']).toBe('LANDSCAPE');
    });
    it('should NOT turn to landscape', function () {
        //lock screen to portrait orientation
        browser.click('#lockButton');
        expect(browser.orientation()['value']).toBe('PORTRAIT');
        try {
            browser.orientation('landscape');
            fail('should not be able to change orientation to landscape, should be locked to portrait instead');
        }
        catch (error) {
            expect(error.seleniumStack.orgStatusMessage).toContain('Unable To Rotate Device');
        }
    });
    it('should select correct action', function () {
        browser.click('#openActionSheet');
        browser.pause(500);
        //switch to NATIVE_APP context
        browser.context('NATIVE_APP');
        var delEl = browser.element("~Go home");
        delEl.click();
        browser.pause(500);
        //go back to web context
        browser.context(browser.contexts().value[1]);
        var selectedAction = browser.getText('#selectedAction');
        expect(selectedAction).toBe('Button pressed: ' + 1);
        browser.click('#openActionSheet');
        browser.pause(500);
        browser.context('NATIVE_APP');
        delEl = browser.element("~Travel the world");
        delEl.click();
        browser.pause(500);
        browser.context(browser.contexts().value[1]);
        selectedAction = browser.getText('#selectedAction');
        expect(selectedAction).toBe('Button pressed: ' + 2);
        browser.click('#openActionSheet');
        browser.pause(500);
        browser.context('NATIVE_APP');
        delEl = browser.element("~Blow up the world");
        delEl.click();
        browser.pause(500);
        browser.context(browser.contexts().value[1]);
        selectedAction = browser.getText('#selectedAction');
        expect(selectedAction).toBe('Button pressed: ' + 3);
    });
    it('should take picture', function () {
        var imageSrcAtBegin = browser.getAttribute('#myImage', 'src');
        browser.click('#cameraButton');
        browser.context('NATIVE_APP');
        browser.pause(2000);
        try {
            browser.alertDismiss();
            browser.pause(2000);
        }
        catch (e) {
            //console.log('***************alertDismiss() error: '+JSON.stringify(e));
        }
        //todo: replace tap coordinates according to defined device (e.g. use capabilities)
        //switch camera
        browser.touchPerform([{
                action: 'tap',
                options: {
                    x: 316, y: 695
                }
            }]);
        browser.pause(2000);
        //take picture
        browser.touchPerform([{
                action: 'tap',
                options: {
                    x: 188, y: 695
                }
            }]);
        browser.pause(3000);
        //use picture
        browser.touchPerform([{
                action: 'tap',
                options: {
                    x: 316, y: 735
                }
            }]);
        browser.pause(2000);
        //back to web context
        browser.context(browser.contexts().value[1]);
        var imageSrc = browser.getAttribute('#myImage', 'src');
        expect(imageSrc).not.toBe(imageSrcAtBegin);
        expect(imageSrc).toContain('data:image/jpeg;base64');
    });
});
//# sourceMappingURL=home.spec.js.map