def parse_nlq(text: str):
    text = text.lower()
    filters = {}

    if "low molecular weight" in text:
        filters["molwt_max"] = 300

    if "high molecular weight" in text:
        filters["molwt_min"] = 500

    if "active" in text:
        filters["is_active"] = 1

    if "inactive" in text:
        filters["is_active"] = 0

    if "low logp" in text:
        filters["logp_max"] = 3

    if "high logp" in text:
        filters["logp_min"] = 4

    return filters
