import React from 'react';
import {Card} from 'antd';

const FAQPage = () => {
    return (
        <>
            <div className="site-card-wrapper">
                <Card title="Frequently Asked Questions" bordered={false}>
                    <h5><b>Q: Why is the voice box not showing up?</b></h5> 
                    <p>You may be using an unsupported browser. Try switching to Google Chrome or Microsoft Edge.</p>

                
                    <h5><b>Q: Where do I see what parts I have?</b></h5>
                    <p>The Parts page will list all the parts you have and you can modify/add more there.</p>


                    <h5><b>Q: How do I get a backup of all this information?</b></h5>
                    <p>The Dashboard has an Export button that saves a file copy of all your parts.</p>


                    <h5><b>Q: Can I change the location of a container if I move it?</b></h5>
                    <p>Yes! The containers on the Container page have the ability to be edited by clicking on the pencil symbol.</p>
                </Card>

            </div>
        </>
    );
};

export default FAQPage;
