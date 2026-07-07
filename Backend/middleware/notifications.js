exports.triggerNotificationSystem = (eventType, recipientPayload, contextualData) => {
  const logTimestamp = new Date().toLocaleString();
  console.log(`\n===  [AUTOMATED NOTIFICATION: ${eventType}] ===`);
  console.log(`[Timestamp]: ${logTimestamp}`);
  console.log(`[Recipient]: ${recipientPayload.name} (<${recipientPayload.email}>)`);
  
  switch(eventType) {
    case 'RENT_DUE':
      console.log(`[Alert]: New monthly statement active. KES ${contextualData.amount} due.`);
      break;
    case 'PAYMENT_RECEIVED':
      console.log(`[Alert]: Payment confirmation logged! KES ${contextualData.amount} captured.`);
      break;
    case 'MAINTENANCE_UPDATE':
      console.log(`[Alert]: Request Ticket Status updated to: [${contextualData.status}].`);
      break;
    default:
      console.log(`[Alert]: Standard system audit broadcast executed.`);
  }
  console.log(`======================================================\n`);
};