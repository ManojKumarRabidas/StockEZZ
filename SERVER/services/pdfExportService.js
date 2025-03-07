const PdfPrinter = require('pdfmake');

module.exports = {
 generateBill : async (doc) => {
    console.log("doc", doc)
    console.log("doc", doc.items[0].item)
    try {
        const fonts = {
            Roboto: {
                normal: "assets/fonts/Roboto-Regular.ttf",
                bold: "assets/fonts/Roboto-Medium.ttf",
                italics: "assets/fonts/Roboto-Italic.ttf",
                bolditalics: "assets/fonts/Roboto-MediumItalic.ttf",
            }
        };

        const printer = new PdfPrinter(fonts);
        

        // const docDefinition = {
        //     content: [
        //         { text: doc.userType, style: 'header' },
        //         // Add your content here based on data
        //     ],
        //     styles: {
        //         header: {
        //             fontSize: 18,
        //             bold: true
        //         }
        //     }
        // };

        const docDefinition = {
            content: [
              { text: "Talukder Hardware", style: "header", alignment: "center" },
            //   { text: `GST No: ${doc.gstNo}\nContact Number: ${doc.contact}\nAddress: ${doc.address}`, alignment: "center", margin: [0, 5, 0, 10] },
            //   { text: `Date: ${doc.date}`, alignment: "right", margin: [0, 5, 0, 10] },
        
              {
                table: {
                  headerRows: 1,
                  widths: ["*", "*", "*", "*", "*", "*", "*", "*", "*"],
                  body: [
                    ["Product Name", "Brand", "Color", "Capacity", "Height", "Quantity", "Price", "Total price"],
                    ...doc.items.map(p => [p.item.item_name, p.item.brand_name, p.item.color, p.item.capacity, p.item.height, p.quantity, p.sell_price, p.quantity*p.sell_price])
                  ],
                },
                layout: "lightHorizontalLines",
                margin: [0, 5, 0, 5],
              },
        
              {
                text: `Total: ${doc.total}\nGST: 00 \nAdditional Charges: ${doc.additional_charges}\nDiscount: ${doc.discount}\nGrand Total: ${doc.grandTotal}`,
                alignment: "right",
                margin: [0, 10, 0, 10]
              },
        
              {
                columns: [
                  { text: `Payment Type: ${doc.payment_type}` },
                  { text: ` Paid Amount: ${doc.paid_amount}` },
                  { text: ` Remaining Amount: ${doc.ramaining_amount}` },
                  { text: ` Installation: ${doc.pending_installation}` },
                ],
                margin: [0, 10, 0, 10],
              },
              
              { text: doc.info, margin: [0, 10, 0, 10] },
              { text: "Buyer Details", style: "bold", alignment: "center" },
              {
                columns: [
                  { text: `Name: ${doc.buyer.name}` },
                  { text: `Phone: ${doc.buyer.phone}` },
                  { text: `Email: ${doc.buyer.email}` },
                ],
                margin: [0, 10, 0, 10],
              },
              {
                columns: [
                    { text: `PIN: ${doc.buyer.pin}` },
                    { text: `Aadhar: ${doc.buyer.aadhar}` },
                    { text: `Address: ${doc.buyer.address}` },
                ],
                margin: [0, 10, 0, 10],
              },
              
            //   {
            //     table: {
            //       widths: ["*", "*"],
            //       body: doc.contacts.map(c => [c.label, c.value]),
            //     },
            //     layout: "lightHorizontalLines",
            //     margin: [0, 10, 0, 10],
            //   },
            ],
            styles: {
              header: { fontSize: 16, bold: true },
            },
          };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        return { status: true, doc: pdfDoc };
    } catch (err) {
        console.log("arrrr", err)
        return { status: false, err: err.message };
    }
},
}