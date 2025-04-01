const PdfPrinter = require('pdfmake');

module.exports = {
  generateBill : async (doc) => {
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
        const docDefinition = {
            footer: {
              columns: [
                {},
                 { text: `Signature of Seller`, alignment: "right", margin: [0, 0, 30, 0] }
              ]
            },
          watermark:{ text: 'StockEZZ', opacity: 0.03, bold: true, italics: false },
      content: [
        { text: `${doc.company.name}`, style: "header", alignment: "center" , margin: [0, 0, 0, 3]},
        { text: `GST No: ${doc.company.gstNo}`, fontSize: 10, alignment: "center" , margin: [0, 0, 0, 3]},
        { text: `Phone No: +91 ${doc.company.phone}`,  fontSize: 10, alignment: "center" , margin: [0, 0, 0, 3]},
        { text: `Email Id: ${doc.company.email}`,  fontSize: 10, alignment: "center" , margin: [0, 0, 0, 3]},
        { text: `Address: ${doc.company.address}`, fontSize: 10, alignment: "center" , margin: [0, 0, 0, 2]},
        {
          canvas: [
            { 
              type: 'line', 
              x1: 0, y1: 5, x2: 520, y2: 5, 
              lineWidth: 1, 
              color: 'gray',
              opacity: 0.2
            }
          ],
          margin: [0, 10]
        },
        {
          columns: [
            { text: `Bill No: ${doc.billNo ? doc.billNo : "N/A"}`, alignment: "left"  },
            { text: `Date: ${doc.date}`,  alignment: 'right' },
          ],
          margin: [0, 0, 0, 10],
        },
        
          {
          table: {
            headerRows: 1,
            widths: [325, 45, 40, 60],
              body: [
              ["Description", {text: `Quantity`, alignment: 'center'}, {text: `Price`, alignment: 'right'}, {text: `Total price`, alignment: 'right'}],
              ...doc.items.map(p => [p.item.description,{text: `${p.quantity}`, alignment: 'center'}, {text: `${p.sell_price}`, alignment: 'right'},  {text: `${p.quantity*p.sell_price}`, alignment: 'right'}])
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 5, 0, 0],
        },
        {
          canvas: [
              { 
                  type: 'line', 
                  x1: 0, y1: 5, x2: 520, y2: 5, 
                  lineWidth: 1, 
                  color: 'gray',
                  opacity: 0.2
              }
          ],
      },

        {
          table: {
            widths: [120, 40],
            body: [
              ["Total : ", {text: `${doc.total}`, alignment: 'right'}],
              ["GST : ", {text: `00`, alignment: 'right'}],
              ["Additional Charges : ", {text: `${doc.additional_charges}`, alignment: 'right'}],
              ["Discount", {text: `${doc.discount}`, alignment: 'right'}],
              ["Grand Total", {text: `${doc.grandTotal}`, alignment: 'right'}],
            ],
          },
          layout: "noBorders",
          margin: [353, 5, 0, 5],
        },
        
        {
          canvas: [
              { 
                  type: 'line', 
                  x1: 0, y1: 5, x2: 520, y2: 5, 
                  lineWidth: 1, 
                  color: 'gray',
                  opacity: 0.2
              }
          ],
      },

        {
          columns: [
            { text: `Payment Type: ${doc.payment_type}`, alignment: "left"  },
            { text: ` Paid Amt: ${doc.paid_amount}`, alignment: "center"  },
            { text: ` Remaining Amt: ${doc.remaining_amount ? doc.remaining_amount: "00"}`, alignment: "right"  }
          ],
          margin: [0, 10, 0, 10],
        },
        {
            columns: [
                { text: `Installation: ${doc.pending_installation ? doc.pending_installation : "N/A"}`, alignment: "left" },
                { text: `Installation Date: N/A`, alignment: "right" }
              ]
        },
        
         { text: `Info: ${doc.info}`, margin: [0, 10, 0, 30] },
         {
          canvas: [
              { 
                  type: 'line', 
                  x1: 0, y1: 5, x2: 520, y2: 5, 
                  lineWidth: 1, 
                  color: 'gray',
                  opacity: 0.2
              }
          ],
          margin: [0, 7]
      },
          { text: "Buyer Details", style: "bold", alignment: "center", fontSize: 13 },
          // { text: ' ', margin: [0, 1] },
          {
            canvas: [
                { 
                    type: 'line', 
                    x1: 0, y1: 5, x2: 520, y2: 5, 
                    lineWidth: 1, 
                    color: 'gray',
                    opacity: 0.2
                }
            ],
            margin: [0, 1]
        },
          
           {
                      columns: [
                        { text: `Name: ${doc.buyer.name}`,alignment: "left" },
                        { text: `Phone: ${doc.buyer.phone}`,  alignment: "center"  },
                        { text: `Email: ${doc.buyer.email}`,  alignment: "right" },
                      ],
                      margin: [0, 5, 0, 5],
                    },
      
       {
                      columns: [
                          { text: `PIN: ${doc.buyer.pin}`, alignment: "left" },
                          { text: `Aadhar: ${doc.buyer.aadhar}`,  alignment: "center"  },
                          { text: `Address: ${doc.buyer.address}`,  alignment: "right" },
                      ],
                      margin: [0, 5, 0, 30],
                    },
                   
      
      ],
      styles: {
                    header: { fontSize: 16, bold: true },
                  },
          };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        return { status: true, doc: pdfDoc };
    } catch (err) {
        return { status: false, err: err.message };
    }
  },
  generateSellerInvoice: async(doc)=>{
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
      const docDefinition = {
        footer: {
          columns: [
            {},
            {
              stack: [
                { text: doc.operator, alignment: "right", margin: [0, 5, 30, 0] },
                { text: "Signature of Operator", alignment: "right", margin: [0, 0, 30, 0], bold: true}
              ]
            }
          ]
        },
        watermark:{ text: 'StockEZZ', opacity: 0.03, bold: true, italics: false },
        content: [
          { text: `${doc.company.name}`, style: "header", alignment: "center" , margin: [0, 0, 0, 3]},
          { text: `GST No: ${doc.company.gstNo}`, fontSize: 10, alignment: "center" , margin: [0, 0, 0, 3]},
          { text: `Phone No: +91 ${doc.company.phone}`,  fontSize: 10, alignment: "center" , margin: [0, 0, 0, 3]},
          { text: `Email Id: ${doc.company.email}`,  fontSize: 10, alignment: "center" , margin: [0, 0, 0, 3]},
          { text: `Address: ${doc.company.address}`, fontSize: 10, alignment: "center" , margin: [0, 0, 0, 2]},
          { text: `Seller Invoice`, fontSize: 13, alignment: "center" , margin: [0, 0, 0, 2]},
          {
            canvas: [
              { 
                type: 'line', 
                x1: 0, y1: 5, x2: 520, y2: 5, 
                lineWidth: 1, 
                color: 'gray',
                opacity: 0.2
              }
            ],
            margin: [0, 10]
          },
          {
            columns: [
              { text: `Challan No: ${doc.challan_no ? doc.challan_no : "N/A"}`, alignment: "left"  },
              { text: `Date: ${doc.today}`,  alignment: 'right' },
            ],
            margin: [0, 0, 0, 10],
          },
          {
            columns: [
              { text: `Seller: ${doc.seller ? doc.seller : "N/A"}`, alignment: "left"  },
              {},
            ],
            margin: [0, 0, 0, 10],
          },
          
          {
            table: {
              headerRows: 1,
              widths: [40, 80, 50, 50, 40, 40, 60],
                body: [
                ["Date", "Description","Batch Id", "Batch No" ,{text: `Quantity`, alignment: 'center'}, {text: `Price`, alignment: 'right'}, {text: `Total price`, alignment: 'right'}],
                ...doc.items.map(p => [p.date, p.description, p.batch_id, p.batch_no, {text: `${p.quantity}`, alignment: 'center'}, {text: `${p.item_buy_price}`, alignment: 'right'},  {text: `${p.total}`, alignment: 'right'}])
              ],
            },
            layout: "lightHorizontalLines",
            margin: [0, 5, 0, 0],
          },

          {
            canvas: [
                { 
                    type: 'line', 
                    x1: 0, y1: 5, x2: 520, y2: 5, 
                    lineWidth: 1, 
                    color: 'gray',
                    opacity: 0.2
                }
            ],
          },

          {
            table: {
              widths: [120, 40],
              body: [
                ["Total : ", {text: `${doc.grandTotal}`, alignment: 'right'}],
              ],
            },
            layout: "noBorders",
            margin: [353, 5, 0, 5],
          },
          
          {
            canvas: [
                { 
                    type: 'line', 
                    x1: 0, y1: 5, x2: 520, y2: 5, 
                    lineWidth: 1, 
                    color: 'gray',
                    opacity: 0.2
                }
            ],
          },
// ---------------------------------------------------------------------------------------------------------------------------
        //   {
        //     columns: [
        //       { text: `Payment Type: ${doc.payment_type}`, alignment: "left"  },
        //       { text: ` Paid Amt: ${doc.paid_amount}`, alignment: "center"  },
        //       { text: ` Remaining Amt: ${doc.remaining_amount ? doc.remaining_amount: "00"}`, alignment: "right"  }
        //     ],
        //     margin: [0, 10, 0, 10],
        //   },
        //   {
        //       columns: [
        //           { text: `Installation: ${doc.pending_installation ? doc.pending_installation : "N/A"}`, alignment: "left" },
        //           { text: `Installation Date: N/A`, alignment: "right" }
        //         ]
        //   },
          
        //   { text: `Info: ${doc.info}`, margin: [0, 10, 0, 30] },
        //   {
        //     canvas: [
        //         { 
        //             type: 'line', 
        //             x1: 0, y1: 5, x2: 520, y2: 5, 
        //             lineWidth: 1, 
        //             color: 'gray',
        //             opacity: 0.2
        //         }
        //     ],
        //     margin: [0, 7]
        // },
        //     { text: "Buyer Details", style: "bold", alignment: "center", fontSize: 13 },
        //     // { text: ' ', margin: [0, 1] },
        //     {
        //       canvas: [
        //           { 
        //               type: 'line', 
        //               x1: 0, y1: 5, x2: 520, y2: 5, 
        //               lineWidth: 1, 
        //               color: 'gray',
        //               opacity: 0.2
        //           }
        //       ],
        //       margin: [0, 1]
        //   },
            
        //     {
        //                 columns: [
        //                   { text: `Name: ${doc.buyer.name}`,alignment: "left" },
        //                   { text: `Phone: ${doc.buyer.phone}`,  alignment: "center"  },
        //                   { text: `Email: ${doc.buyer.email}`,  alignment: "right" },
        //                 ],
        //                 margin: [0, 5, 0, 5],
        //               },
        
        // {
        //                 columns: [
        //                     { text: `PIN: ${doc.buyer.pin}`, alignment: "left" },
        //                     { text: `Aadhar: ${doc.buyer.aadhar}`,  alignment: "center"  },
        //                     { text: `Address: ${doc.buyer.address}`,  alignment: "right" },
        //                 ],
        //                 margin: [0, 5, 0, 30],
        //               },
                    
        
        ],
        styles: {
                      header: { fontSize: 16, bold: true },
                    },
            };

      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      return { status: true, doc: pdfDoc };
  } catch (err) {
      return { status: false, err: err.message };
  }
  },
}