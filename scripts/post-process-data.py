import pandas as pd
from argparse import ArgumentParser
from pathlib import Path
import json


DATA_TYPE_IDX = 1
FLAG_TYPE = 'bool'


if __name__ == '__main__':
    # Get all boolean signals (flags) that have explicit state transitions to track
    data_format_path = Path(__file__).parent.parent / 'Backend' / 'Data' / 'sc1-data-format' / 'format.json'
    print(data_format_path)
    with open(data_format_path, 'r') as data_format_fp:
        data_format_json = json.load(data_format_fp)

    flag_sigs = [
        sig
        for sig, info in data_format_json.items()
        if info[DATA_TYPE_IDX] == FLAG_TYPE
    ]

    argparser = ArgumentParser()
    argparser.add_argument('-d', '--data-path', type=Path, required=True, help='Path to data download csv')
    argparser.add_argument('-s', '--signals', nargs='+', choices=flag_sigs, required=True, help='Signals whose transitions should be tracked')
    args = argparser.parse_args()

    # The file needs to exist to be parsed
    assert (data_path := args.data_path).is_file()

    data = pd.read_csv(data_path, index_col=0)

    # The signals and timestamps need to exist in the file to be parse
    signals = args.signals
    assert all(sig in data.columns for sig in signals)

    # Get all timestamps where specified signals transition values
    data = data[signals]
    timestamps = set()
    for sig in signals:
        timestamps |= set(data[sig][1:][data[sig].diff()[1:].astype(int) != 0].dropna().index.values)
