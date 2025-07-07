---
library_name: transformers
license: apache-2.0
base_model: distilbert-base-uncased
tags:
- generated_from_trainer
metrics:
- accuracy
- f1
model-index:
- name: distilbert-base-uncased-finetuned-sst-2-english
  results: []
---

<!-- This model card has been generated automatically according to the information the Trainer had access to. You
should probably proofread and complete it, then remove this comment. -->

# distilbert-base-uncased-finetuned-sst-2-english

This model is a fine-tuned version of [distilbert-base-uncased](https://huggingface.co/distilbert-base-uncased) on the None dataset.
It achieves the following results on the evaluation set:
- Loss: 0.2034
- Accuracy: 0.9502
- F1: 0.9438

## Model description

More information needed

## Intended uses & limitations

More information needed

## Training and evaluation data

More information needed

## Training procedure

### Training hyperparameters

The following hyperparameters were used during training:
- learning_rate: 2e-05
- train_batch_size: 16
- eval_batch_size: 32
- seed: 42
- optimizer: Use OptimizerNames.ADAMW_TORCH with betas=(0.9,0.999) and epsilon=1e-08 and optimizer_args=No additional optimizer arguments
- lr_scheduler_type: linear
- num_epochs: 4

### Training results

| Training Loss | Epoch | Step | Validation Loss | Accuracy | F1     |
|:-------------:|:-----:|:----:|:---------------:|:--------:|:------:|
| 0.2025        | 1.0   | 246  | 0.1804          | 0.9440   | 0.9316 |
| 0.141         | 2.0   | 492  | 0.1714          | 0.9481   | 0.9375 |
| 0.1192        | 3.0   | 738  | 0.1822          | 0.9502   | 0.9425 |
| 0.0646        | 4.0   | 984  | 0.2034          | 0.9502   | 0.9438 |


### Framework versions

- Transformers 4.53.1
- Pytorch 2.7.1+cpu
- Datasets 3.6.0
- Tokenizers 0.21.2
