#!/usr/bin/env bash

model_override=""
input_price_override=""
output_price_override=""

is_valid_non_negative_number() {
  [[ "$1" =~ ^[0-9]+([.][0-9]+)?$ ]]
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --model)
      if [[ -z "${2:-}" ]]; then
        echo "Error: --model requires a value" >&2
        exit 1
      fi
      model_override="$2"
      shift 2
      ;;
    --model=*)
      model_override="${1#*=}"
      shift
      ;;
    --input)
      if [[ -z "${2:-}" ]]; then
        echo "Error: --input requires a value" >&2
        exit 1
      fi
      input_price_override="$2"
      shift 2
      ;;
    --input=*)
      input_price_override="${1#*=}"
      shift
      ;;
    --output)
      if [[ -z "${2:-}" ]]; then
        echo "Error: --output requires a value" >&2
        exit 1
      fi
      output_price_override="$2"
      shift 2
      ;;
    --output=*)
      output_price_override="${1#*=}"
      shift
      ;;
    -h|--help)
      echo "Usage: ./script.sh [--model <model-id>] [--input <usd-per-1m>] [--output <usd-per-1m>]"
      echo "Example: ./script.sh --model openai/gpt-5.4 --input 2.5 --output 15"
      exit 0
      ;;
    *)
      echo "Error: unknown argument '$1'" >&2
      echo "Usage: ./script.sh [--model <model-id>] [--input <usd-per-1m>] [--output <usd-per-1m>]" >&2
      exit 1
      ;;
  esac
done

if [[ -n "$model_override" ]]; then
  export MODEL="$model_override"
fi

if [[ -n "$input_price_override" ]]; then
  if ! is_valid_non_negative_number "$input_price_override"; then
    echo "Error: --input must be a non-negative number" >&2
    exit 1
  fi
  export INPUT_COST_PER_MILLION_USD="$input_price_override"
fi

if [[ -n "$output_price_override" ]]; then
  if ! is_valid_non_negative_number "$output_price_override"; then
    echo "Error: --output must be a non-negative number" >&2
    exit 1
  fi
  export OUTPUT_COST_PER_MILLION_USD="$output_price_override"
fi

for s in 1 2 3 4 5 6; do
  bun run "benchmark:scenario${s}:regular"
  bun run "benchmark:scenario${s}:code-mode"
done
