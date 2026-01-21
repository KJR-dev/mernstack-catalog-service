import config from "config";
import { KafkaProducerBroker } from "../../config/kafka";
import { MessageProducerBroker } from "../types/broker";

let messageProducer: MessageProducerBroker | null = null;

export const createMessageProducerBroker = (): MessageProducerBroker => {
    // Making singleton
    if (!messageProducer) {
        messageProducer = new KafkaProducerBroker(
            "catalog-service",
            config.get("kafka.brokers"),
        );
    }
    return messageProducer;
};
