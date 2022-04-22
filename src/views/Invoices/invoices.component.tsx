import React from 'react';
import "./invoices.component.css";
import { IonModal, IonContent, IonHeader, IonButtons, IonButton, IonToolbar, IonTitle } from "@ionic/react";

interface InvoicesModalConponentProps {
    job: any;
    isOpen: boolean;
    setIsOpen: Function;
}

export default function InvoicesComponent(props: InvoicesModalConponentProps) {
    const { job, isOpen, setIsOpen } = props;
    return job.invoiceData && (
        <IonModal
            isOpen={isOpen}
            swipeToClose={true}>
            <IonHeader >
                <IonToolbar>
                    <IonTitle >Invoice #{job?.invoiceData.invoiceTitle}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="danger" onClick={() => setIsOpen(false)}>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent style={{ "--background": "#1A233A" }}>
                <main>
                    <div className="container">
                        <div className="row gutters">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                <div className="card">
                                    <div className="card-body p-0">
                                        <div className="invoice-container">
                                            <div className="invoice-header">
                                                <div className="row gutters">
                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                        <small className="invoice-logo text-capitalize">
                                                            {job?.invoiceData.companyName}
                                                        </small>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                                        <address className="text-right text-capitalize">
                                                            {job?.invoiceData.companyAddress2 + ", " + job?.invoiceData.clientCountry}<br />
                                                        </address>
                                                    </div>
                                                </div>

                                                <div className="row gutters">
                                                    <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                                                        <div className="invoice-details text-capitalize">
                                                            <address>
                                                                {job?.invoiceData.clientName}<br />
                                                                {job?.invoiceData.clientAddress2 + ", " + job?.invoiceData.clientCountry}
                                                            </address>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                                                        <div className="invoice-details">
                                                            <div className="invoice-num">
                                                                <div>Invoice - # {job?.invoiceData.invoiceTitle}</div>
                                                                <div><small className='pr-2'>Received On:</small> {new Date(job?.invoiceData.invoiceDate).toDateString()}</div>
                                                                <div><small className='pr-2'> Due Date: </small>{new Date(job?.invoiceData.invoiceDueDate).toDateString()}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="invoice-body">
                                                <div className="row gutters">
                                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                                        <div className="table-responsive">
                                                            <table className="table custom-table m-0">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Job</th>
                                                                        <th>Frequency</th>
                                                                        <th colSpan={2}>Rate</th>
                                                                        <th colSpan={2}>Sub Total</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        job?.invoiceData.productLines.map((productLine: any) => {
                                                                            return (
                                                                                <tr key={Math.random()}>
                                                                                    <td>
                                                                                        {productLine.description}
                                                                                    </td>
                                                                                    <td>{productLine.quantity}</td>
                                                                                    <td colSpan={2}>KSH: {productLine.rate}</td>
                                                                                    <td colSpan={2}>KSH: {productLine.rate * productLine.quantity}</td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                    <tr>
                                                                        <td colSpan={2}>
                                                                            <p>
                                                                                Subtotal<br />
                                                                                Miscellaneous<br />
                                                                            </p>
                                                                            <h5 className="text-success"><strong>Grand Total</strong></h5>
                                                                        </td>
                                                                        <td colSpan={4}>
                                                                            <p>
                                                                                KSH: {job?.invoiceData.subTotal}<br />
                                                                                KSH: 0.00<br />
                                                                            </p>
                                                                            <h5 className="text-success"><strong>KSH: {job?.invoiceData.subTotal}</strong></h5>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="invoice-footer">
                                                <small>
                                                    designed by {'{domm}'}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </IonContent>
        </IonModal>

    );
}
