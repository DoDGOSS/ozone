def _get_dict_from_dn(dn):
    return dict(x.split('=') for x in dn.split(',') if '=' in x)


def get_cac_id(dn):
    d = _get_dict_from_dn(dn)
    ret = dict()
    ret['username'] = d['CN']
    return ret
