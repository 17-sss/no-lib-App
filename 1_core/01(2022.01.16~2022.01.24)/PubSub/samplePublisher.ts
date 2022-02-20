import Publisher from "./classes/Publisher";

export interface SamplePublisherState {
  /* do something.. */
}

export const initSampleState: Readonly<SamplePublisherState> = {
  /* do something.. */
};

export const samplePublisher: Publisher<SamplePublisherState> = new Publisher({ ...initSampleState });
