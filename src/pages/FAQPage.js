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

                    <h5><b>Q: How do I go about adding a Part?</b></h5>
                    <p>To add a Part, navigate to the Parts page and enter the name of the Part and optionally a category for the Part.</p>

                    <h5><b>Q: Where can I find more help for performing actions?</b></h5>
                    <p>On each necessary page there is a '?' symbol in the top left that will help give information about each page.</p>

                    <h5><b>Q: How would I update a Part or Container and why would I do that?</b></h5>
                    <p>The corresponding page will have a pencil symbol next to each item. Click this for the item you want to update and edit the desired fields before hitting enter.</p>

                    <h5><b>Q: What if I want to get rid of something in the system?</b></h5>
                    <p>For each item there is a trashcan symbol next to the item. Click this to prompt a confirmation message, once you confirm the deletion the item will be removed.</p>
                </Card>

            </div>
        </>
    );
};

export default FAQPage;
