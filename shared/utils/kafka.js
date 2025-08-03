const { Kafka } = require('kafkajs');
const logger = require('./logger');

const kafka = new Kafka({
  clientId: 'battery-passport',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'battery-passport-group' });

const connectProducer = async () => {
  try {
    await producer.connect();
    logger.info('Kafka producer connected');
  } catch (error) {
    logger.error('Failed to connect Kafka producer:', error);
    throw error;
  }
};

const disconnectProducer = async () => {
  try {
    await producer.disconnect();
    logger.info('Kafka producer disconnected');
  } catch (error) {
    logger.error('Failed to disconnect Kafka producer:', error);
  }
};

const sendMessage = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [
        {
          key: Date.now().toString(),
          value: JSON.stringify(message),
        },
      ],
    });
    logger.info(`Message sent to topic ${topic}:`, message);
  } catch (error) {
    logger.error(`Failed to send message to topic ${topic}:`, error);
    throw error;
  }
};

const connectConsumer = async () => {
  try {
    await consumer.connect();
    logger.info('Kafka consumer connected');
  } catch (error) {
    logger.error('Failed to connect Kafka consumer:', error);
    throw error;
  }
};

const disconnectConsumer = async () => {
  try {
    await consumer.disconnect();
    logger.info('Kafka consumer disconnected');
  } catch (error) {
    logger.error('Failed to disconnect Kafka consumer:', error);
  }
};

const subscribeToTopic = async (topic, handler) => {
  try {
    await consumer.subscribe({ topic, fromBeginning: true });
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = JSON.parse(message.value.toString());
          logger.info(`Received message from topic ${topic}:`, value);
          await handler(value);
        } catch (error) {
          logger.error(`Error processing message from topic ${topic}:`, error);
        }
      },
    });
    
    logger.info(`Subscribed to topic: ${topic}`);
  } catch (error) {
    logger.error(`Failed to subscribe to topic ${topic}:`, error);
    throw error;
  }
};

module.exports = {
  connectProducer,
  disconnectProducer,
  sendMessage,
  connectConsumer,
  disconnectConsumer,
  subscribeToTopic,
}; 